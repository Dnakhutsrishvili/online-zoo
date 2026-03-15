  export const validateName=(value: string): boolean =>{
    return /^[a-zA-Z\s]+$/.test(value.trim());
  }