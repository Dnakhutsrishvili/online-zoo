 export const validateLogin=(v: string): string=> {
    if (!v) return "Login is required.";
    if (!/^[a-zA-Z]/.test(v)) return "Must start with a letter.";
    if (!/^[a-zA-Z]+$/.test(v)) return "Only English letters allowed.";
    if (v.length < 3) return "At least 3 characters.";
    return "";
  }
