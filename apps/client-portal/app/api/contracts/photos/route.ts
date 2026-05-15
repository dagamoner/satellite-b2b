import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

/**
 * Genera una URL firmada para acceder a las fotos de evidencia de un contrato.
 * El técnico sube las fotos a Supabase Storage, y para visualizarlas de forma segura 
 * en el PDF (lado del cliente), necesitamos URLs firmadas temporales.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Path is required" }, { status: 400 });
  }

  try {
    // Generar URL firmada válida por 60 minutos
    const { data, error } = await supabase
      .storage
      .from("contracts")
      .createSignedUrl(path, 3600);

    if (error) {
      console.error("[API_PHOTOS_ERROR]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch (err) {
    console.error("[API_PHOTOS_CATCH]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
