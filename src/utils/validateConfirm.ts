export const validateConfirm = (value: string): string => {
  if (!value) return "Please confirm your password.";
  return "";
};
