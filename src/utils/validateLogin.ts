export const validateLogin=(value: string): string => {
  if (!value) return "Login is required.";
  if (!/^[a-zA-Z]/.test(value)) return "Login must start with a letter.";
  if (!/^[a-zA-Z]+$/.test(value)) return "Login must contain only English letters.";
  if (value.length < 3) return "Login must be at least 3 characters.";
  return "";
}
