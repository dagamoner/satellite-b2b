import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// Usamos las variables de entorno para conectar con Supabase Storage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    await await cookies();
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json({ error: "Path no proporcionado" }, { status: 400 });
    }

    // Generar URL firmada por 60 segundos
    const { data, error } = await supabase.storage
      .from("contratos-evidencia")
      .createSignedUrl(path, 60);

    if (error) throw error;

    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch (error: any) {
    console.error("[GET /api/contracts/photos]", error);
    return NextResponse.json({ error: "Error al generar URL firmada" }, { status: 500 });
  }
}
