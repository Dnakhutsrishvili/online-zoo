export const validatePassword=(value: string): string =>{
  if (!value) return "Password is required.";
  if (value.length < 6) return "Password must be at least 6 characters.";
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(value))
    return "Password must contain at least 1 special character.";
  return "";
}