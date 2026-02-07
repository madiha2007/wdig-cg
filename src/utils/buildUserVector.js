import { TRAITS } from "./traits";

export function buildUserVector(profile) {
  return TRAITS.map(trait => profile[trait] ?? 0);
}
