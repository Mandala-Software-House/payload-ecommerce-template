import { useTranslations } from "next-intl";
import { z } from "zod";

export type LoginFormData = {
  email: string;
  password: string;
};

export const useLoginFormSchema = () => {
  const t = useTranslations("LoginForm.errors");

  const LoginFormSchema = z.object({
    email: z.string().nonempty(t("email-empty")).email(t("email")),
    password: z.string().nonempty(t("password")),
  });

  return { LoginFormSchema };
};
