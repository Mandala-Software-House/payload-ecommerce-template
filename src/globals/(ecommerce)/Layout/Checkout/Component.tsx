import { notFound } from "next/navigation";
import { type ReactNode } from "react";

import { type Locale } from "@/i18n/config";
import { getCachedGlobal } from "@/utilities/getGlobals";

import { OneStepWithSummary } from "./variants/OneStepWithSummary";

export const Checkout = async ({ locale }: { locale: Locale }) => {
  const { checkout } = await getCachedGlobal("shopLayout", locale, 1)();

  let CheckoutComponent: ReactNode = null;
  switch (checkout.type) {
    case "OneStepWithSummary":
      CheckoutComponent = <OneStepWithSummary locale={locale} />;
      break;
  }

  if (!CheckoutComponent) {
    notFound();
  }

  return CheckoutComponent;
};
