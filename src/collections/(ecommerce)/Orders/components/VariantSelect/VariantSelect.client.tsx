"use client";
import { Select, useField, useFormFields, useLocale } from "@payloadcms/ui";
import axios from "axios";
import { stringify } from "qs-esm";
import { useEffect, useState } from "react";

import { type VariantsArr } from ".";

import { type Product } from "@/payload-types";

export const VariantSelectClient = ({ path }: { path: string }) => {
  const { value, setValue } = useField<string>({ path });
  const [options, setOptions] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  const productID = useFormFields(([fields]) => {
    return fields[path.replace("variantSlug", "product")].value as string;
  });

  const handleVariantChange = (valueToSet: VariantsArr[number]) => {
    setValue(valueToSet.value);
  };

  const locale = useLocale();

  const query = stringify(
    {
      select: {
        variants: {
          variantSlug: true,
        },
      },
    },
    { addQueryPrefix: true },
  );

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const { data } = await axios.get<Product>(`/api/products/${productID}${query}&locale=${locale.code}`, {
          withCredentials: true,
        });
        if (!data?.variants) {
          return;
        }
        setOptions(
          data.variants.map((variant) => ({
            label: variant.variantSlug ?? "",
            value: variant.variantSlug ?? "",
          })),
        );
      } catch (error) {
        console.log(error);
      }
    };

    void fetchVariants();
  }, [productID, locale.code, query]);

  return (
    <Select
      value={{
        label: value,
        value,
      }}
      onChange={handleVariantChange}
      options={options}
    />
  );
};
