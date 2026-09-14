// Fórmula alinhada a PAYMENT-PROFILE.md §3 (exemplo: base R$150 → gross R$152,53).
// Comissão e antecipação incidem sobre a BASE (sem a taxa que o cliente paga pra
// cobrir o Asaas); a taxa do Asaas incide sobre o GROSS (o que foi cobrado de
// verdade). As duas eram tratadas como o mesmo número — por isso a comissão batia
// errado e o app_total superestimava o lucro (somava a antecipação em vez de
// subtrair). `gross` é opcional pra manter os recomputes de disputa parcial (que só
// conhecem uma base reduzida) sem precisar recalcular um gross reduzido.
export function computeSplit(base: number, gross: number = base) {
  const appCommissionPercent = 15;
  const appCommissionAmount = base * (appCommissionPercent / 100);
  // 1,99% conferido direto no formulário "Criar cobrança" do painel Asaas em
  // 2026-09-13 ("Taxa de 1,99% sobre o valor da cobrança + R$0,49") e validado com
  // uma simulação real de R$100 → líquido R$97,52. Igual à do app
  // (moppy-mobile/src/utils/price.ts) — medir de novo na 1ª cobrança de produção
  // (ASAAS-PRODUCAO-CHECKLIST.md §4), sandbox e produção podem divergir.
  const asaasFee = 0.49 + gross * 0.0199;
  // A faxineira rateia a taxa só sobre a parte do serviço. A taxa de urgência é 100% do
  // app (BUSINESS-RULES.md §1.4), então a taxa de cartão que ela gera também é — senão a
  // faxineira paga metade de uma taxa sobre dinheiro que não é dela. O app fica com o resto.
  const cleanerBaseCharged = base + (0.49 + base * 0.0199) / 2;
  const feeShare = (0.49 + cleanerBaseCharged * 0.0199) / 2;
  const anticipationCost = base * 0.0065;
  const cleanerGross = base - appCommissionAmount;
  const cleanerNet = cleanerGross - feeShare;

  return {
    base,
    gross_total: gross,
    app_commission_percent: appCommissionPercent,
    app_commission_amount: appCommissionAmount,
    app_processing_fee_share: asaasFee - feeShare,
    app_anticipation_cost: anticipationCost,
    app_total: gross - asaasFee - cleanerNet - anticipationCost,
    cleaner_processing_fee_share: feeShare,
    cleaner_gross: cleanerGross,
    cleaner_net: cleanerNet,
  };
}
