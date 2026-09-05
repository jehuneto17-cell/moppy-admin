// Rode com: npx tsx lib/mapbox.selfcheck.ts
import { distanceKm } from "./mapbox";

const saoPaulo = { lat: -23.5505, lng: -46.6333 };
const rio = { lat: -22.9068, lng: -43.1729 };

const km = distanceKm(saoPaulo, rio);
console.assert(km > 350 && km < 370, `esperado ~357km SP-RJ, veio ${km}`);
console.assert(distanceKm(saoPaulo, saoPaulo) === 0, "distância pro mesmo ponto deve ser 0");
console.log("mapbox.selfcheck OK — SP-RJ:", km.toFixed(1), "km");
