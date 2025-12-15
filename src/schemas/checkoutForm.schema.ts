import { useTranslations } from "next-intl";
import { z, type ZodType } from "zod";

export const CheckoutFormSchemaServer = z.object({
  buyerType: z.string().nonempty(),
  individualInvoice: z.boolean(),
  invoice: z
    .object({
      name: z.string().nonempty(),
      address: z.string().nonempty(),
      city: z.string().nonempty(),
      country: z.string().nonempty(),
      region: z.string().nonempty(),
      postalCode: z.string().nonempty(),
      tin: z.string().optional(),
    })
    .optional(),
  shipping: z.object({
    id: z.string().optional(),
    name: z.string().nonempty(),
    address: z.string().nonempty(),
    city: z.string().nonempty(),
    country: z.string().nonempty(),
    region: z.string().nonempty(),
    postalCode: z.string().nonempty(),
    phone: z.string().nonempty(),
    email: z.string().nonempty().email(),
    pickupPointID: z.string().optional(),
    pickupPointAddress: z.string().optional(),
  }),
  deliveryMethod: z.string().nonempty(),
});

export type CheckoutFormData = z.infer<typeof CheckoutFormSchemaServer>;

export const useCheckoutFormSchema = () => {
  const t = useTranslations("CheckoutForm.errors");

  const CheckoutFormSchema = z.object({
    buyerType: z.string().nonempty(),
    individualInvoice: z.boolean(),
    invoice: z
      .object({
        name: z.string(),
        address: z.string(),
        city: z.string(),
        country: z.string(),
        region: z.string(),
        postalCode: z.string(),
        tin: z.string().optional(),
      })
      .optional(),
    shipping: z.object({
      id: z.string().optional(),
      name: z.string().nonempty(t("shipping.name")),
      address: z.string().nonempty(t("shipping.address")),
      city: z.string().nonempty(t("shipping.city")),
      country: z.string().nonempty(t("shipping.country")),
      region: z.string().nonempty(t("shipping.region")),
      postalCode: z.string().nonempty(t("shipping.postalCode")),
      phone: z.string().nonempty(t("shipping.phone")),
      email: z.string().nonempty(t("shipping.email")).email(t("shipping.email")),
      pickupPointID: z.string().optional(),
      pickupPointAddress: z.string().optional(),
    }),
    deliveryMethod: z.string().nonempty(t("deliveryMethod")),
  });

  const RefinedCheckoutFormSchema = CheckoutFormSchema.superRefine((data, ctx) => {
    if (
      data.buyerType === "company" &&
      data.individualInvoice &&
      (!data.invoice?.tin || data.invoice.tin.trim() === "")
    ) {
      ctx.addIssue({
        code: "custom",
        message: "TIN is required for companies.",
        path: ["invoice", "tin"],
      });
    }

    if (data.individualInvoice) {
      if (
        !data.invoice ||
        Object.entries(data.invoice).some(([key, value]) => {
          return key !== "tin" && (!value || value.trim() === "");
        })
      ) {
        Object.entries(data.invoice ?? {}).forEach(([key, value]) => {
          if (key !== "tin" && (!value || value.trim() === "")) {
            type invoiceObject = Exclude<
              keyof NonNullable<z.infer<typeof CheckoutFormSchemaServer>["invoice"]>,
              undefined
            >;
            const typedKey = key as invoiceObject;
            ctx.addIssue({
              code: "custom",
              message: t(`invoice.${typedKey}`),
              path: ["invoice", key],
            });
          }
        });
      }
    }
  });

  const ShippingSchema = z.object({
    shipping: CheckoutFormSchema.shape.shipping,
  });

  return {
    CheckoutFormSchema: RefinedCheckoutFormSchema,
    ShippingFormSchemaResolver: ShippingSchema,
  };
};
