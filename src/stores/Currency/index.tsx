"use client";
import { create } from "zustand";

import canUseDOM from "@/utilities/canUseDOM";

import { type Currency } from "./types";

type CurrencyState = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

const getInitialCurrency = (): Currency => {
  if (canUseDOM) {
    const stored = window.localStorage.getItem("currency") as Currency | null;
    if (stored) return stored;
  }
  return "USD";
};

const useCurrencyStore = create<CurrencyState>((set) => ({
  currency: getInitialCurrency(),
  setCurrency: (currencyToSet: Currency) => {
    if (canUseDOM) {
      window.localStorage.setItem("currency", currencyToSet);
    }
    set({ currency: currencyToSet });
  },
}));

export const useCurrency = () => useCurrencyStore();
