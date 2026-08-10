import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Sembrando datos de prueba en SQLite...");

  // 1. Crear Técnico de prueba
  const tech = await prisma.user.upsert({
    where: { email: "tecnico@mrtechnology.com.ar" },
    update: {},
    create: {
      email: "tecnico@mrtechnology.com.ar",
      name: "Técnico Instalador MR",
      role: "TECH",
    },
  });

  // 2. Crear Contrato de prueba (Fundamental para login en soporte)
  const contract = await prisma.installationContract.upsert({
    where: { contractNumber: "MR-2026-0001" },
    update: {},
    create: {
      contractNumber: "MR-2026-0001",
      status: "COMPLETED",
      clientName: "Cliente de Prueba MR",
      clientEmail: "prueba@cliente.com",
      clientPhone: "+54 9 261 1234567",
      clientDni: "12345678",
      address: "Calle Falsa 123, Mendoza",
      equipmentType: "STANDARD_V4",
      planType: "BASICO_V4",
      monthlyFee: 56100.0,
      technicianId: tech.id,
      installationNotes: "Instalación de prueba realizada con éxito."
    },
  });

  console.log("✅ Datos sembrados:");
  console.log(` - Técnico: ${tech.name}`);
  console.log(` - Contrato: ${contract.contractNumber} (DNI: 12345678)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
