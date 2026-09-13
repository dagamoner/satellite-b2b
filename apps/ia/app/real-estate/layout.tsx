import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MR Real Estate · CENI Construcoes — Florianópolis",
  description:
    "Portal comercial de MR Real Estate y CENI Construcoes. Proyectos inmobiliarios en Brasil: Mar do Norte Studios, BERIYTH Residence y Serene Beach Residence.",
};

export default function RealEstateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {children}
    </div>
  );
}
