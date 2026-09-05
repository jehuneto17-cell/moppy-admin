// Mock do Asaas — mesma interface do cliente real (lib/asaas.ts). Preauthorize e
// capturePayment não existem mais: essa conta não pode reservar sem cobrar
// (PAYMENT-PROFILE.md §0), então o mock também cobra na hora.
function fakeId(prefix: string) {
  return `${prefix}_mock_${Math.random().toString(36).slice(2, 10)}`;
}

export async function createCustomer(params: { name: string; cpfCnpj: string; email: string; mobilePhone?: string }) {
  return { id: fakeId("cus") };
}

export async function tokenizeCard(params: { creditCard: { number: string } }) {
  return {
    creditCardToken: fakeId("card"),
    creditCardNumber: params.creditCard.number.slice(-4),
    creditCardBrand: "VISA",
  };
}

// Token especial pra testar o caminho de falha/retry sem precisar de um cartão
// recusado de verdade no sandbox (ver PAYMENT-IMPLEMENTATION.md §5.2).
export async function createCharge(params: { customerId: string; cardToken: string; amount: number; orderId: string; description: string }) {
  if (params.cardToken === "card_mock_declined") {
    const err = new Error("cartão recusado (mock)") as Error & { status: number; errors: unknown[] };
    err.status = 400;
    err.errors = [{ code: "invalid_creditCard", description: "cartão recusado (mock)" }];
    throw err;
  }
  return {
    id: fakeId("pay"),
    status: "CONFIRMED" as const,
    value: params.amount,
    netValue: params.amount - (0.49 + params.amount * 0.03),
    externalReference: params.orderId,
    dateCreated: new Date().toISOString().slice(0, 10),
  };
}

export async function getPayment(paymentId: string) {
  return { id: paymentId, status: "CONFIRMED" as const, value: 0, netValue: 0, externalReference: null, dateCreated: new Date().toISOString().slice(0, 10) };
}

export async function findByExternalReference(orderId: string) {
  return null;
}

export async function refundPayment(params: { paymentId: string; value?: number; description?: string }) {
  return { id: fakeId("refund"), status: "REFUNDED" as const, value: params.value ?? 0, netValue: 0, externalReference: null, dateCreated: new Date().toISOString().slice(0, 10) };
}

export async function createPixTransfer(params: { value: number; pixAddressKey: string; pixAddressKeyType: string }) {
  return { id: fakeId("transfer"), status: "PENDING" as const, value: params.value };
}
