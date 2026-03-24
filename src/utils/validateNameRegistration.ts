export const validateNameRegistration=(value: string): string => {
  if (!value) return "Name is required.";
  if (!/^[a-zA-Z]+$/.test(value)) return "Name must contain only English letters.";
  if (value.length < 3) return "Name must be at least 3 characters.";
  return "";
}
