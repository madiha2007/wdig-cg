// src/utils/vectorizeTraits.js

import { TRAITS } from "./traits";

export const traitsToVector = (traits) => {
  return TRAITS.map((t) => traits[t] ?? 0);
};
