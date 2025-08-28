"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import Cookies from "js-cookie";

export default function ShareTokenHandler({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const shareToken = searchParams.get("share_token");
    if (shareToken) {
    //   Cookies.set("share_token", shareToken, { expires: 1 });
      router.replace(pathname, { scroll: false });
    }
  }, [searchParams, router, pathname]);

//   return <>{children}</>;
}
