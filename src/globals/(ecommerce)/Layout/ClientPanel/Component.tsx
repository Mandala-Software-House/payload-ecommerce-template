import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { type ReactNode } from "react";

import { type Locale } from "@/i18n/config";
import { getCachedGlobal } from "@/utilities/getGlobals";

import { WithSidebar } from "./variants/WithSidebar";

export const ClientPanel = async ({ children }: { children: ReactNode }) => {
  const locale = (await getLocale()) as Locale;
  const { clientPanel } = await getCachedGlobal("shopLayout", locale, 1)();

  let ClientPanelComponent: ReactNode = null;
  switch (clientPanel.type) {
    case "withSidebar":
      ClientPanelComponent = <WithSidebar>{children}</WithSidebar>;
      break;
  }

  if (!ClientPanelComponent) {
    notFound();
  }

  return ClientPanelComponent;
};
