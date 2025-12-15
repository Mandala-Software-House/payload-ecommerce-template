import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const Page = () => {
  redirect("/admin");
};
export default Page;
