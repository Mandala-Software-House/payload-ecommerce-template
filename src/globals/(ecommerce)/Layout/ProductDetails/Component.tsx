import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { type ReactNode } from "react";

import { type Locale } from "@/i18n/config";
import { type Product } from "@/payload-types";
import { getCachedGlobal } from "@/utilities/getGlobals";

import { WithImageGalleryExpandableDetails } from "./variants/WithImageGalleryExpandableDetails";

import { ProductBreadcrumbs } from "../../../../components/(ecommerce)/ProductBreadcrumbs";

export const ProductDetails = async ({ variant, product }: { variant?: string; product: Product }) => {
  const locale = (await getLocale()) as Locale;
  const { productDetails } = await getCachedGlobal("shopLayout", locale, 1)();

  let ProductDetailsComponent: ReactNode = null;
  switch (productDetails.type) {
    case "WithImageGalleryExpandableDetails":
      ProductDetailsComponent = (
        <WithImageGalleryExpandableDetails
          variant={variant}
          productSettings={productDetails}
          product={product}
        />
      );
      break;
  }

  if (!ProductDetailsComponent) {
    notFound();
  }

  return (
    <>
      <ProductBreadcrumbs product={product} />
      {ProductDetailsComponent}
    </>
  );
};
