// Mesma fórmula de apps/mobile/src/utils/price.ts::computeCleanerEarnings (PAYMENT-PROFILE.md) —
// duplicada aqui porque o Metro (mobile) e o Next (web-admin) não compartilham um bundler comum
// pra puxar de shared/utils sem config extra (mesmo racional de shared/mocks/asaas, ver IMPLEMENTATION-PLAN.md).
export function computeSplit(grossTotal: number) {
  const appCommissionPercent = 15;
  const appCommissionAmount = grossTotal * (appCommissionPercent / 100);
  const asaasFee = 0.49 + grossTotal * 0.03;
  const feeShare = asaasFee / 2;
  const anticipationCost = grossTotal * 0.0065;
  const cleanerNet = grossTotal - appCommissionAmount - feeShare;

  return {
    gross_total: grossTotal,
    app_commission_percent: appCommissionPercent,
    app_commission_amount: appCommissionAmount,
    app_processing_fee_share: feeShare,
    app_anticipation_cost: anticipationCost,
    app_total: appCommissionAmount + feeShare + anticipationCost,
    cleaner_processing_fee_share: feeShare,
    cleaner_gross: grossTotal - appCommissionAmount,
    cleaner_net: cleanerNet,
  };
}
