import { useTranslations } from "next-intl";
import { z } from "zod";

export type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

export const useResetPasswordForm = () => {
  const t = useTranslations("ResetPasswordForm.errors");

  const ResetPasswordForm = z
    .object({
      newPassword: z.string().nonempty(t("password-length")).min(8, t("password-length")),
      confirmPassword: z.string().nonempty(t("password-length")).min(8, t("password-length")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwords-mismatch"),
      path: ["confirmPassword"],
    });

  return { ResetPasswordForm };
};
