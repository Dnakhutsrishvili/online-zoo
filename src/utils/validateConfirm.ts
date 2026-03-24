export const validateConfirm=(value: string): string => {
  if (!value) return "Please confirm your password.";
  if (value !== passwordInput.value) return "Passwords do not match.";
  return "";
}
