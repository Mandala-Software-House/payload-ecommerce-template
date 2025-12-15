import path from "path";
import { fileURLToPath } from "url";

import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { s3Storage } from "@payloadcms/storage-s3";
import { en } from "@payloadcms/translations/languages/en";
import { pl } from "@payloadcms/translations/languages/pl";
import { buildConfig } from "payload";
import sharp from "sharp"; // sharp-import

import { defaultLexical } from "@/fields/defaultLexical";

import { customTranslationsObject } from "./admin/translations/custom-translations";
import { Customers } from "./collections/(ecommerce)/Customers";
import { Orders } from "./collections/(ecommerce)/Orders";
import { ProductCategories } from "./collections/(ecommerce)/ProductCategories";
import { ProductReviews } from "./collections/(ecommerce)/ProductReviews";
import { ProductSubCategories } from "./collections/(ecommerce)/ProductSubCategories";
import { Products } from "./collections/(ecommerce)/Products";
import { Administrators } from "./collections/Administrators";
import { Categories } from "./collections/Categories";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Posts } from "./collections/Posts";
import { InPostCourier } from "./globals/(ecommerce)/Couriers/InPostCourier/config";
import { InPostCourierCOD } from "./globals/(ecommerce)/Couriers/InPostCourierCOD/config";
import { InPostPickup } from "./globals/(ecommerce)/Couriers/InPostPickup/config";
import { Fulfilment } from "./globals/(ecommerce)/Fulfilment";
import { ShopLayout } from "./globals/(ecommerce)/Layout/config";
import { Paywalls } from "./globals/(ecommerce)/Paywalls/config";
import { ShopSettings } from "./globals/(ecommerce)/ShopSettings/config";
import { EmailMessages } from "./globals/EmailMessages/config";
import { Footer } from "./globals/Footer/config";
import { Header } from "./globals/Header/config";
import { plugins } from "./plugins";
import { getServerSideURL } from "./utilities/getURL";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    avatar: {
      Component: "@/components/AdminAvatar#AdminAvatar",
    },
    components: {
      afterLogin: ["@/components/AdminResetPassword#AdminResetPassword"],
      graphics: {
        Logo: "@/components/AdminLogoBig/AdminLogoBig#AdminLogoBig",
        Icon: "@/components/AdminLogoIcon/AdminLogoIcon#AdminLogoIcon",
      },
      Nav: {
        path: "@/components/AdminNavbar#AdminNavbar",
      },
      beforeDashboard: ["@/components/BeforeDashboard#BeforeDashboard"],
      views: {
        dashboard: {
          Component: "@/components/(ecommerce)/AdminDashboard#AdminDashboard",
        },
      },
      beforeNavLinks: ["@/components/(ecommerce)/AdminDashboardNavLink#AdminDashboardNavLink"],
    },
    meta: {
      icons: [
        {
          type: "image/svg+xml",
          url: "/favicon.svg",
          rel: "icon",
        },
      ],
      title: "Admin Panel",
      titleSuffix: "| Mandala SH",
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Administrators.slug,
    livePreview: {
      breakpoints: [
        {
          label: "Mobile",
          name: "mobile",
          width: 375,
          height: 667,
        },
        {
          label: "Tablet",
          name: "tablet",
          width: 768,
          height: 1024,
        },
        {
          label: "Desktop",
          name: "desktop",
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  i18n: {
    supportedLanguages: { en, pl },
    fallbackLanguage: "en",
    translations: customTranslationsObject,
  },
  localization: {
    locales: ["en", "pl"],
    defaultLocale: "en",
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI ?? "",
  }),
  collections: [
    Pages,
    Posts,
    Media,
    Categories,
    Administrators,
    Customers,
    Orders,
    Products,
    ProductCategories,
    ProductSubCategories,
    ProductReviews,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [
    Header,
    Footer,
    EmailMessages,
    ShopSettings,
    ShopLayout,
    InPostPickup,
    InPostCourier,
    InPostCourierCOD,
    Paywalls,
    Fulfilment,
  ],
  plugins: [
    ...plugins,
    s3Storage({
      collections: {
        [Media.slug]: true,
      },
      bucket: process.env.S3_BUCKET ?? "",
      config: {
        endpoint: process.env.S3_ENDPOINT ?? "",
        region: "auto",
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
        },
        requestChecksumCalculation: "WHEN_REQUIRED",
        responseChecksumValidation: "WHEN_REQUIRED",
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
