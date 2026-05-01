export function validateCVV(v: string) {
  return /^\d{3}$/.test(v);
}
