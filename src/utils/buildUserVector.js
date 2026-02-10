import { TRAITS } from "./traits";

export function buildUserVector(responses) {
  return TRAITS.map(trait => responses[trait] ?? 0);
}
