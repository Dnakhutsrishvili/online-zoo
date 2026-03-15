export const validatePassword=(v: string): string=> {
    if (!v) return "Password is required.";
    return "";
  }