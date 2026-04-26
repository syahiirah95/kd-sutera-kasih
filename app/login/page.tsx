import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    switch?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams({
    auth: "login",
    next: params.next?.startsWith("/") && !params.next.startsWith("//") ? params.next : "/venue",
  });

  if (params.switch === "1") {
    query.set("switch", "1");
  }

  redirect(`/?${query.toString()}`);
}
