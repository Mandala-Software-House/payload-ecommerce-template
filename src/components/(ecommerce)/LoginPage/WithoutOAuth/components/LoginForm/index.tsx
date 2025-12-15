"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios, { isAxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/routing";
import { type LoginFormData, useLoginFormSchema } from "@/schemas/loginForm.schema";
import { useCart } from "@/stores/CartStore";

export const LoginForm = () => {
  const { LoginFormSchema } = useLoginFormSchema();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const t = useTranslations("LoginForm");
  const router = useRouter();
  const { synchronizeCart } = useCart();

  const onSubmit = async (values: LoginFormData) => {
    try {
      const res = await axios.post("/api/customers/login", values);
      if (res.status === 200 || res.status === 201) {
        void synchronizeCart();
        router.replace("/account/orders");
        router.refresh();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          form.setError("root", { message: t("errors.auth") });
        } else {
          form.setError("root", { message: t("errors.server-error") });
        }
      } else {
        console.log(error);
        form.setError("root", { message: t("errors.server-error") });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("password")}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root?.message ? (
          <p className="text-sm text-red-500">{form.formState.errors.root?.message}</p>
        ) : (
          ""
        )}
        <div className="ml-auto text-sm/6">
          <Link href="/forgot-password" className="text-main-600 hover:text-main-500 font-semibold">
            {t("forgot-password")}
          </Link>
        </div>
        <Button type="submit" variant="tailwind">
          {t("submit")}
        </Button>
      </form>
    </Form>
  );
};
