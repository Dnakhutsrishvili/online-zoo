import { SavedCard } from "../models/card";
export function getSavedCards(): SavedCard[] {
  return JSON.parse(localStorage.getItem("zoo-saved-cards") || "[]");
}
