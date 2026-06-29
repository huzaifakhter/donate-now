import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "INR", symbol: "₹", label: "INR (₹)" },
  { code: "CAD", symbol: "$", label: "CAD ($)" },
  { code: "AUD", symbol: "$", label: "AUD ($)" },
];

export function getCurrencySymbol(currency: string = "USD") {
  const match = CURRENCIES.find(c => c.code === currency.toUpperCase());
  return match ? match.symbol : "$";
}

export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.5,
  CAD: 1.37,
  AUD: 1.51,
};

let cachedRates: Record<string, number> | null = null;
let lastFetched: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour cache

export async function fetchExchangeRates(): Promise<Record<string, number>> {
  const now = Date.now();
  if (cachedRates && (now - lastFetched < CACHE_DURATION)) {
    return cachedRates;
  }

  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error("Failed to fetch rates");
    const data = await res.json();
    if (data && data.rates) {
      cachedRates = data.rates;
      lastFetched = now;
      return data.rates;
    }
  } catch (err) {
    console.error("Failed to fetch real-time exchange rates, using fallback:", err);
  }

  return EXCHANGE_RATES;
}

export function convertCurrency(
  amount: number,
  from: string,
  to: string,
  rates?: Record<string, number>
): number {
  const currentRates = rates || EXCHANGE_RATES;
  const fromRate = currentRates[from.toUpperCase()] || EXCHANGE_RATES[from.toUpperCase()] || 1.0;
  const toRate = currentRates[to.toUpperCase()] || EXCHANGE_RATES[to.toUpperCase()] || 1.0;
  const amountInUSD = amount / fromRate;
  return amountInUSD * toRate;
}
