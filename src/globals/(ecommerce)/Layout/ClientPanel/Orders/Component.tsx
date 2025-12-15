import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { type ReactNode } from "react";

import { type Locale } from "@/i18n/config";
import { getCachedGlobal } from "@/utilities/getGlobals";

import { WithSidebarOrders } from "../variants/WithSidebar/components/WithSidebarOrders";

export const Orders = async () => {
  const locale = (await getLocale()) as Locale;
  const { clientPanel } = await getCachedGlobal("shopLayout", locale, 1)();

  let OrdersComponent: ReactNode = null;
  switch (clientPanel.type) {
    case "withSidebar":
      OrdersComponent = <WithSidebarOrders />;
      break;
  }

  if (!OrdersComponent) {
    notFound();
  }

  return OrdersComponent;
};
