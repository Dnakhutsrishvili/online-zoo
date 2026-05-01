export function validateCardNumber(v: string) {
  return /^\d{16}$/.test(v.replace(/\s/g, ""));
}
