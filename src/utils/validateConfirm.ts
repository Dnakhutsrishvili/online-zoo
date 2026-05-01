export function validateConfirm(value: string, password: string): string {
  if (!value) return "Please confirm your password.";
  if (value !== password) return "Passwords do not match.";
  return "";
}
