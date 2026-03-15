export const formatCardLabel=(cardNumber: string): string =>{
  const d = cardNumber.replace(/\D/g, "");
  return `${d.slice(0, 4)} **** **** ${d.slice(-4)}`;
}