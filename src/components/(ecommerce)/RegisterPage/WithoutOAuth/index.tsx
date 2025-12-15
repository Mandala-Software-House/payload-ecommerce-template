"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";

import { RegisterForm } from "./components/RegisterForm";

export const RegisterPageWithoutOAuth = () => {
  const t = useTranslations("RegisterForm");
  return (
    <main className="flex h-full flex-1 flex-col items-center justify-center bg-gray-50">
      <div className="container flex w-full flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Image
            alt="Mandala Software House"
            width={125}
            height={88}
            src="/mandala.svg"
            className="mx-auto -my-5 h-20 w-auto invert"
          />
          <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">{t("title")}</h2>
        </div>

        <div className="mt-10 w-full sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
            <RegisterForm />
          </div>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            {t("have-account")}{" "}
            <Link href="/register" className="text-main-600 hover:text-main-500 font-semibold">
              {t("login-now")}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};
