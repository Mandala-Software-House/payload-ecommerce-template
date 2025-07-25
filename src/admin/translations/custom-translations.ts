import type { NestedKeysStripped } from "@payloadcms/translations";

export const customTranslationsObject = {
  en: {
    custom: {
      inPostMessage:
        "InPost charges fees for generating shipments. Check your balance, customer data and dimensions before creating a shipment.",
      generating: "Generating...",
      downloadLabel: "Download label",
      downloadingLabel: "Downloading...",
      createPackage: "Create package",
      resetPackage: "Reset package",
      resetPassword: "Reset password (enter email in form)",
      resetPasswordSuccess: "Password reset link sent to email",
      resetPasswordError: "Error resetting password",
    },
    adminDashboard: {
      linkTitle: "Dashboard",
      searchNoResults: "No results",
      search: "Search collections...",
      addProduct: "Add product",
      totalRevenue: "Total revenue",
      totalOrders: "Total orders",
      rangedRevenue: "Revenue in period",
      rangedOrders: "Orders in period",
      "from-last-month": "from last month",
      overview: "Overview",
      revenue: "Revenue",
      orders: "Orders",
      columns: "Columns",
      jan: "January",
      feb: "February",
      mar: "March",
      apr: "April",
      may: "May",
      jun: "June",
      jul: "July",
      aug: "August",
      sep: "September",
      oct: "October",
      nov: "November",
      dec: "December",
      filterEmails: "Filter emails...",
      recentOrders: "Recent orders",
      date: "Date",
      status: "Status",
      email: "Email",
      amount: "Amount",
      pending: "Pending",
      paid: "Paid",
      unpaid: "Unpaid",
      processing: "Processing",
      shipped: "Shipped",
      completed: "Completed",
      cancelled: "Cancelled",
      returned: "Returned",
      previous: "Previous",
      next: "Next",
      actions: "Actions",
      copyPaymentID: "Copy payment ID",
      viewCustomer: "View customer",
      viewOrder: "View order",
      openMenu: "Open menu",
    },
  },
  pl: {
    custom: {
      inPostMessage:
        "InPost nalicza opłaty za generowanie przesyłek. Sprawdź swoje saldo, dane klienta i gabaryt przed utworzeniem przesyłki.",
      generating: "Generowanie...",
      downloadLabel: "Pobierz etykietę",
      downloadingLabel: "Pobieranie...",
      createPackage: "Utwórz przesyłkę",
      resetPackage: "Resetuj przesyłkę",
      resetPassword: "Resetuj hasło (wpisz e-mail w formularzu)",
      resetPasswordSuccess: "Link do resetowania hasła został wysłany na podany adres e-mail",
      resetPasswordError: "Błąd resetowania hasła",
    },
    adminDashboard: {
      linkTitle: "Panel",
      searchNoResults: "Brak wyników",
      search: "Szukaj w kolekcjach...",
      addProduct: "Dodaj produkt",
      totalRevenue: "Całkowity przychód",
      totalOrders: "Liczba zamówień",
      rangedRevenue: "Przychód w okresie",
      rangedOrders: "Zamówienia w okresie",
      "from-last-month": "z poprzedniego miesiąca",
      overview: "Podsumowanie",
      "recent-orders": "Ostatnie zamówienia",
      revenue: "Przychód",
      orders: "Zamówienia",
      columns: "Kolumny",
      jan: "Styczeń",
      feb: "Luty",
      mar: "Marzec",
      apr: "Kwiecień",
      may: "Maj",
      jun: "Czerwiec",
      jul: "Lipiec",
      aug: "Sierpień",
      sep: "Wrzesień",
      oct: "Październik",
      nov: "Listopad",
      dec: "Grudzień",
      filterEmails: "Filtruj emaile...",
      recentOrders: "Ostatnie zamówienia",
      date: "Data",
      status: "Status",
      email: "Email",
      amount: "Kwota",
      pending: "Oczekuje",
      paid: "Opłacone",
      unpaid: "Nieopłacone",
      processing: "Przetwarzane",
      shipped: "Wysłane",
      completed: "Zakończone",
      cancelled: "Anulowane",
      returned: "Zwrócone",
      previous: "Poprzednie",
      next: "Następne",
      actions: "Akcje",
      copyPaymentID: "Kopiuj ID płatności",
      viewCustomer: "Zobacz klienta",
      viewOrder: "Zobacz zamówienie",
      openMenu: "Otwórz menu",
    },
  },
};

export type CustomTranslationsObject = typeof customTranslationsObject.en;
export type CustomTranslationsKeys = NestedKeysStripped<CustomTranslationsObject>;
