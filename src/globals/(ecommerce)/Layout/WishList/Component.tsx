import { getLocale } from "next-intl/server";
import { type ReactNode } from "react";

import { type Locale } from "@/i18n/config";
import { getCachedGlobal } from "@/utilities/getGlobals";

import { SlideOver } from "./variants/SlideOver";

export const WishList = async () => {
  const locale = (await getLocale()) as Locale;
  const { cartAndWishlist } = await getCachedGlobal("shopLayout", locale, 1)();

  let WishListComponent: ReactNode = null;
  switch (cartAndWishlist.type) {
    case "slideOver":
      WishListComponent = <SlideOver />;
      break;
  }

  return WishListComponent;
};
