import { useTranslations } from "next-intl";
import { z } from "zod";

export type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export const RegisterFormSchemaServer = z
  .object({
    email: z.string().nonempty().email(),
    password: z.string().nonempty().min(8),
    confirmPassword: z.string().nonempty(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
  });

export const useRegisterFormSchema = () => {
  const t = useTranslations("RegisterForm.errors");

  const RegisterFormSchema = z
    .object({
      email: z.string().nonempty(t("email-empty")).email(t("email")),
      password: z.string().nonempty(t("password")).min(8, t("password-length")),
      confirmPassword: z.string().nonempty(t("password")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwords-mismatch"),
      path: ["confirmPassword"],
    });

  return { RegisterFormSchema };
};
