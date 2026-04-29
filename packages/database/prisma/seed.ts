import { prisma } from "../src/index";

async function main() {
  console.log("🌱 Sembrando datos pro-producción (SQLite Local)...");

  // 1. Crear Técnico de prueba
  const tech = await prisma.user.upsert({
    where: { email: "tecnico@mrtechnology.com.ar" },
    update: { role: "TECH" },
    create: {
      email: "tecnico@mrtechnology.com.ar",
      name: "Técnico Instalador MR",
      role: "TECH",
    },
  });

  // 2. Crear Administrador de prueba
  await prisma.user.upsert({
    where: { email: "admin@mrtechnology.com.ar" },
    update: { role: "ADMIN" },
    create: {
      email: "admin@mrtechnology.com.ar",
      name: "Administrador NOC",
      role: "ADMIN",
    },
  });

  // 3. Crear Contrato de prueba (Fundamental para login en soporte)
  const contract = await prisma.installationContract.upsert({
    where: { contractNumber: "MR-2026-0001" },
    update: {
      clientDni: "12345678",
      status: "COMPLETED",
    },
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
      installationNotes: "Instalación de prueba realizada para validación del sistema NOC."
    },
  });

  console.log("✅ Datos sembrados correctamente:");
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
