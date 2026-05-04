"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SoporteRedirectPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/soporte/dashboard");
    } else if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="text-cyan-500 font-black tracking-widest animate-pulse">
        ESTABLECIENDO SESIÓN SEGURA...
      </div>
    </div>
  );
}
