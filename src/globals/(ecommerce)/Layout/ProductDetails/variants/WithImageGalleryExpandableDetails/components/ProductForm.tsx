"use client";

import { Radio, RadioGroup } from "@headlessui/react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as FilledHeartIcon } from "@heroicons/react/24/solid";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { QuantityInput } from "@/components/(ecommerce)/QuantityInput";
import { useRouter } from "@/i18n/routing";
import { type Product } from "@/payload-types";
import { useCart } from "@/stores/CartStore";
import { useWishList } from "@/stores/WishlistStore";
import { cn } from "@/utilities/cn";

import { type FilledVariant } from "../../../types";

export const ProductForm = ({
  product,
  selectedVariant,
  filledVariants,
  minQuantity,
  maxQuantity,
}: {
  product: Product;
  filledVariants?: FilledVariant[];
  selectedVariant?: FilledVariant;
  minQuantity: number;
  maxQuantity: number;
}) => {
  const [quantity, setQuantity] = useState(1);
  const { updateCart, cart } = useCart();

  const defaultVariant = filledVariants?.find((variant) => variant.stock > 0) ?? filledVariants?.[0];

  const { toggleWishList, wishlist } = useWishList();

  const t = useTranslations("ProductDetails");
  const [overStock, setOverStock] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateQuantity = (delta: number) => {
    setQuantity((prev) => {
      const newQty = prev + delta;
      // Clamp the quantity between min and max
      return Math.min(Math.max(newQty, minQuantity), maxQuantity);
    });
  };

  const setSelectedVariant = (slug?: string) => {
    const params = new URLSearchParams(searchParams?.toString());

    if (slug) {
      params.set("variant", slug);
    } else {
      params.delete("variant");
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const isColorAvailable = (colorID: string) => {
    const isAvailable = filledVariants?.find((variant) => {
      return variant.color?.id === colorID && variant.stock > 0;
    });
    return Boolean(isAvailable);
  };

  const findAvailableSizeVariant = (sizeID: string) => {
    const matchingVariant = filledVariants?.find((variant) => {
      return variant.color?.id === selectedVariant?.color?.id && variant.size?.id === sizeID;
    });
    if (matchingVariant && matchingVariant.stock > 0) {
      return matchingVariant;
    }
  };

  const handleChangeSize = (id: string) => {
    const matchingVariant = findAvailableSizeVariant(id);
    if (matchingVariant) {
      setSelectedVariant(matchingVariant.slug ?? undefined);
    }
  };

  const handleChangeColor = (id: string) => {
    const matchingVariant = filledVariants?.filter(
      (variant) => variant.color?.id === id && variant.stock > 0,
    );
    const closestVariant = matchingVariant?.find((variant) => variant.size?.id === selectedVariant?.size?.id);

    if (closestVariant) {
      setSelectedVariant(closestVariant.slug ?? undefined);
    } else if (matchingVariant) {
      setSelectedVariant(matchingVariant[0].slug ?? undefined);
    }
  };

  const isProductAvailable = !(
    (product.enableVariants && (!selectedVariant || selectedVariant.stock === 0)) ??
    (!product.enableVariants && product.stock === 0)
  );

  const cartItem = cart?.find(
    (item) => item.id === product.id && item.choosenVariantSlug === selectedVariant?.slug,
  );

  return (
    <form className="mt-6">
      {/* Colors */}
      {product.variants && product.enableVariants && product.variantsType !== "sizes" && (
        <div>
          <h3 className="text-sm font-medium text-gray-600">{t("color")}</h3>

          <fieldset aria-label={t("choose-color")} className="mt-2">
            <RadioGroup
              value={selectedVariant?.color?.id ?? defaultVariant?.color?.id}
              onChange={handleChangeColor}
              className="flex items-center gap-x-3"
            >
              {product.colors?.map((color) => {
                const isAvailable = isColorAvailable(color.id ?? "");
                return (
                  <Radio
                    key={color.id}
                    value={color.id}
                    aria-label={color.label}
                    disabled={!isAvailable}
                    className={cn(
                      "ring-gray-500",
                      "focus:outline-hidden data-focus:data-checked:ring-3 relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 data-checked:ring-2 data-focus:data-checked:ring-offset-1",
                      !isAvailable && "cursor-not-allowed opacity-25",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      style={{ background: color.colorValue ?? "" }}
                      className={cn("size-8 rounded-full border border-black/10")}
                    />
                  </Radio>
                );
              })}
            </RadioGroup>
          </fieldset>
        </div>
      )}

      {/* Size picker */}
      {product.variants && product.enableVariants && product.variantsType !== "colors" && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-900">{t("size")}</h2>
          </div>

          <fieldset aria-label={t("choose-size")} className="mt-2">
            <RadioGroup
              value={selectedVariant?.size?.id ?? defaultVariant?.size?.id}
              onChange={handleChangeSize}
              className="grid grid-cols-3 gap-3 sm:grid-cols-6"
            >
              {product.sizes?.map((size) => {
                const matchingVariant = findAvailableSizeVariant(size.id ?? "");

                return (
                  <Radio
                    key={
                      matchingVariant
                        ? `${matchingVariant?.size?.id}-${matchingVariant?.color?.id}`
                        : `${size.id}-unavailable`
                    }
                    value={matchingVariant ? matchingVariant?.size?.id : `${size.id}-unavailable`}
                    disabled={!matchingVariant}
                    className={cn(
                      matchingVariant
                        ? "focus:outline-hidden cursor-pointer"
                        : "cursor-not-allowed opacity-25",
                      "flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-3 text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 data-checked:border-transparent data-checked:bg-main-600 data-checked:text-white data-focus:ring-2 data-focus:ring-main-500 data-focus:ring-offset-2 data-checked:hover:bg-main-700 sm:flex-1",
                    )}
                  >
                    {size.label}
                  </Radio>
                );
              })}
            </RadioGroup>
          </fieldset>
        </div>
      )}

      <div className="mt-10 grid grid-cols-2 gap-y-4 sm:flex">
        <button
          type="submit"
          disabled={!isProductAvailable}
          className={cn(
            "focus:outline-hidden col-span-2 row-start-2 flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-main-600 px-8 py-3 text-base font-medium text-white hover:bg-main-700 focus:ring-2 focus:ring-main-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full",
            !isProductAvailable && "cursor-not-allowed opacity-25",
          )}
          onClick={(e) => {
            e.preventDefault();
            if (quantity <= maxQuantity - (cartItem?.quantity ?? 0)) {
              setOverStock(false);
              updateCart([
                {
                  id: product.id,
                  quantity: quantity,
                  choosenVariantSlug: selectedVariant?.slug ?? undefined,
                },
              ]);
            } else {
              setOverStock(true);
            }
          }}
        >
          {isProductAvailable ? t("add-to-cart") : t("product-unavailable")}
        </button>

        <div className="flex">
          <QuantityInput
            maxQuantity={maxQuantity}
            minQuantity={minQuantity}
            setQuantity={setQuantity}
            updateQuantity={updateQuantity}
            quantity={quantity}
          />

          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishList([
                {
                  id: product.id,
                  choosenVariantSlug: selectedVariant?.slug ?? undefined,
                },
              ]);
            }}
            type="button"
            className="ml-4 flex w-fit items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            {wishlist?.find(
              (item) =>
                item.id === product.id &&
                (product.enableVariants ? item.choosenVariantSlug === selectedVariant?.slug : true),
            ) ? (
              <FilledHeartIcon aria-hidden="true" className="size-6 shrink-0" />
            ) : (
              <HeartIcon aria-hidden="true" className="size-6 shrink-0" />
            )}
            <span className="sr-only">{t("add-to-favs")}</span>
          </button>
        </div>
      </div>
      {overStock && (
        <p className="mt-4 text-red-500">
          {maxQuantity - (cartItem?.quantity ?? 0) > 0
            ? `${t("stock-left")} ${maxQuantity - (cartItem?.quantity ?? 0)}`
            : t("maximum-stock")}
        </p>
      )}
    </form>
  );
};
