export function validateExpiry(v: string) {
  if (!/^\d{2}\/\d{2}$/.test(v)) return false;
  const [mm, yy] = v.split("/").map(Number);
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  const cy = now.getFullYear() % 100;
  const cm = now.getMonth() + 1;
  return yy > cy || (yy === cy && mm >= cm);
}
