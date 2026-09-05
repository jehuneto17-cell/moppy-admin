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
  const asaasFee = 0.49 + gross * 0.02;
  const feeShare = asaasFee / 2;
  const anticipationCost = base * 0.0065;
  const cleanerGross = base - appCommissionAmount;
  const cleanerNet = cleanerGross - feeShare;

  return {
    base,
    gross_total: gross,
    app_commission_percent: appCommissionPercent,
    app_commission_amount: appCommissionAmount,
    app_processing_fee_share: feeShare,
    app_anticipation_cost: anticipationCost,
    app_total: appCommissionAmount + feeShare - anticipationCost,
    cleaner_processing_fee_share: feeShare,
    cleaner_gross: cleanerGross,
    cleaner_net: cleanerNet,
  };
}
