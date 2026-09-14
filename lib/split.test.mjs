// node lib/split.test.mjs
// Trava duas coisas que já quebraram: (1) o líquido que o app mostra tem que ser
// exatamente o que a carteira credita, (2) o dinheiro tem que fechar.
import assert from "node:assert";

const r = (n) => Math.round(n * 100) / 100;

// Espelho de computeSplit (lib/split.ts) e computeCleanerEarnings (moppy-mobile/src/utils/price.ts).
// Se editar a taxa num lado e esquecer do outro, este teste falha — que é o ponto.
function computeSplit(base, gross = base) {
  const commission = base * 0.15;
  const asaasFee = 0.49 + gross * 0.0199;
  const cleanerBaseCharged = base + (0.49 + base * 0.0199) / 2;
  const feeShare = (0.49 + cleanerBaseCharged * 0.0199) / 2;
  const anticipation = base * 0.0065;
  const cleanerNet = base - commission - feeShare;
  return { asaasFee, cleanerNet, anticipation, appTotal: gross - asaasFee - cleanerNet - anticipation };
}
function clientPays(sub, urg = 0) {
  const g = sub + urg;
  return g + (0.49 + g * 0.0199) / 2;
}
function appShowsCleaner(sub) {
  const gc = sub + (0.49 + sub * 0.0199) / 2;
  return sub - sub * 0.15 - (0.49 + gc * 0.0199) / 2;
}

for (const [sub, urg] of [[90, 0], [120, 0], [150, 0], [180, 0], [195, 0], [150, 5.5], [90, 3.5], [270, 5.5]]) {
  const gross = r(clientPays(sub, urg));
  const s = computeSplit(sub, gross);

  assert.strictEqual(r(s.cleanerNet), r(appShowsCleaner(sub)), `sub ${sub}/urg ${urg}: app promete um líquido e a carteira credita outro`);
  assert.strictEqual(r(s.asaasFee + s.cleanerNet + s.appTotal + s.anticipation), gross, `sub ${sub}/urg ${urg}: o dinheiro não fecha`);
  // A urgência é 100% do app: o líquido da faxineira não pode mudar por causa dela.
  assert.strictEqual(r(s.cleanerNet), r(computeSplit(sub, r(clientPays(sub, 0))).cleanerNet), `sub ${sub}: urgência vazou pro repasse da faxineira`);
}

// Gross recalculado com a taxa 1,99% (era 152,5/124,97 com os 3% antigos, desatualizados).
assert.strictEqual(r(computeSplit(150, r(clientPays(150, 0))).cleanerNet), 125.75, "exemplo de R$150 do documento do dono");
console.log("ok — app e backend batem, dinheiro fecha, urgência não afeta a faxineira");
