// Cliente HTTP real do Asaas. Substitui o mock (`@moppy/shared/mocks/asaas`, que nem
// resolvia — ver ESTADO.md 2026-09-04). Sem SDK: a API é simples o bastante e um SDK
// third-party seria mais uma dependência pra um punhado de endpoints.
//
// Header de auth é `access_token`, NÃO `Authorization: Bearer` — confirmado ao vivo
// contra o sandbox (Bearer dá 401). Ver PAYMENT-IMPLEMENTATION.md §2.1.
const BASE_URL = process.env.ASAAS_BASE_URL || "https://sandbox.asaas.com/api/v3";

class AsaasError extends Error {
  status: number;
  errors: Array<{ code?: string; description?: string }>;
  constructor(status: number, errors: Array<{ code?: string; description?: string }>) {
    super(errors.map((e) => e.description).filter(Boolean).join("; ") || `Asaas respondeu ${status}`);
    this.name = "AsaasError";
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "moppy-admin",
      access_token: process.env.ASAAS_API_KEY ?? "",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new AsaasError(res.status, json?.errors ?? [{ description: `HTTP ${res.status}` }]);
  }
  return json as T;
}

export type AsaasCustomer = { id: string };

export async function createCustomer(params: { name: string; cpfCnpj: string; email: string; mobilePhone?: string }) {
  return request<AsaasCustomer>("POST", "/customers", params);
}

export type TokenizedCard = { creditCardToken: string; creditCardNumber: string; creditCardBrand: string };

export async function tokenizeCard(params: {
  customer: string;
  remoteIp: string;
  creditCard: { holderName: string; number: string; expiryMonth: string; expiryYear: string; ccv: string };
  creditCardHolderInfo: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    phone: string;
  };
}) {
  return request<TokenizedCard>("POST", "/creditCard/tokenizeCreditCard", params);
}

export type AsaasPayment = {
  id: string;
  status: string;
  value: number;
  netValue: number;
  externalReference: string | null;
  dateCreated: string;
};

// Cobra na hora — não existe "authorizeOnly" pra essa conta (PAYMENT-PROFILE.md §0).
export async function createCharge(params: { customerId: string; cardToken: string; amount: number; orderId: string; description: string }) {
  return request<AsaasPayment>("POST", "/payments", {
    customer: params.customerId,
    billingType: "CREDIT_CARD",
    value: params.amount,
    dueDate: new Date().toISOString().slice(0, 10),
    description: params.description,
    externalReference: params.orderId,
    creditCardToken: params.cardToken,
  });
}

export async function getPayment(paymentId: string) {
  return request<AsaasPayment>("GET", `/payments/${paymentId}`);
}

// Guarda anti-duplicidade: chamar antes de createCharge (PAYMENT-FLOW.md §3.1).
export async function findByExternalReference(orderId: string) {
  const result = await request<{ data: AsaasPayment[] }>("GET", `/payments?externalReference=${encodeURIComponent(orderId)}`);
  return result.data[0] ?? null;
}

export async function refundPayment(params: { paymentId: string; value?: number; description?: string }) {
  const body: Record<string, unknown> = {};
  if (params.value !== undefined) body.value = params.value;
  if (params.description) body.description = params.description;
  return request<AsaasPayment>("POST", `/payments/${params.paymentId}/refund`, body);
}

export type AsaasTransfer = { id: string; status: string; value: number };

// Sem subconta (PAYMENT-PROFILE.md §2): transfere direto da conta principal da
// Moppy pra chave PIX da faxineira.
export async function createPixTransfer(params: {
  value: number;
  pixAddressKey: string;
  pixAddressKeyType: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "EVP";
  description?: string;
}) {
  return request<AsaasTransfer>("POST", "/transfers", params);
}
