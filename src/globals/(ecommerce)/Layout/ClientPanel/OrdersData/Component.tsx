"use client";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { type Customer } from "@/payload-types";
import { cn } from "@/utilities/cn";

import { AddNewAddressDialog } from "../../Checkout/variants/OneStepWithSummary/components/AddNewAddressDialog";

export const OrdersData = ({
  user,
  updateCustomerData,
}: {
  user: Customer;
  updateCustomerData: () => Promise<void>;
}) => {
  const [selectedShipping, setSelectedShipping] = useState(
    user?.shippings?.find((shipping) => shipping.default) ?? user?.shippings?.[0],
  );
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);

  const t = useTranslations("Account.orders-data");

  const setDefaultAddress = async () => {
    await updateCustomerData();
    if (!selectedShipping || !user.shippings?.length) return;

    const updatedShippings = user.shippings.map((shipping) => ({
      ...shipping,
      default: shipping.id === selectedShipping.id,
    }));

    try {
      const { data } = await axios.patch<{ doc: Customer }>(`/api/customers/${user.id}`, {
        shippings: updatedShippings,
      });

      if (data?.doc.shippings) {
        setSelectedShipping(data.doc.shippings.find((s) => s.default) ?? data.doc.shippings[0]);
      }
    } catch (error) {
      console.error("Failed to update default address:", error);
    }
  };

  return (
    <section className="no-prose">
      <AddNewAddressDialog
        open={addressDialogOpen}
        setOpen={setAddressDialogOpen}
        user={user}
        setShipping={async (_shipping) => {
          await updateCustomerData();
        }}
      />
      <h2 className="mb-8 text-xl font-bold">{t("title")}</h2>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {(user.shippings ?? [])
          .sort((a, b) => {
            if (a.default === b.default) return 0;
            return a.default ? -1 : 1;
          })
          .map((shipping) => (
            <div
              onClick={() => {
                setSelectedShipping({
                  ...shipping,
                  id: shipping.id ?? undefined,
                });
              }}
              key={shipping.id}
              className={cn(
                "group relative flex cursor-pointer rounded-lg border border-gray-300 border-transparent bg-white p-4 shadow-xs ring-2 ring-gray-200 focus:outline-hidden",
                shipping.id === selectedShipping?.id && "ring-main-500",
              )}
            >
              <span className="flex flex-1">
                <span className="flex w-full flex-col">
                  <span className="block text-left text-sm font-medium text-gray-900">{shipping.name}</span>
                  <span className="mt-1 flex items-center text-sm text-gray-500">{shipping.address}</span>
                  <span className="mt-1 text-left text-sm font-medium text-gray-500">
                    {shipping.postalCode}, {shipping.city}, {shipping.country}
                  </span>
                  <span className="mt-1 flex items-center text-sm text-gray-500">{shipping.phone}</span>
                  <span className="mt-1 flex items-center text-sm text-gray-500">{shipping.email}</span>
                </span>
              </span>
            </div>
          ))}
      </div>
      <div className="mt-6 flex flex-col gap-6 md:flex-row">
        <Button variant="tailwindOutline" onClick={() => setAddressDialogOpen(true)}>
          {t("add-new")}
        </Button>
        <Button variant="tailwind" onClick={setDefaultAddress}>
          {t("set-as-default")}
        </Button>
      </div>
    </section>
  );
};
