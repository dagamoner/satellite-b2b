import { prisma } from "@repo/database";

async function main() {
  console.log("🚀 Iniciando migración de datos para el CRM...");

  // 1. Obtener todos los contratos existentes
  const contracts = await prisma.installationContract.findMany();
  console.log(`📋 Se encontraron ${contracts.length} contratos existentes.`);

  let accountsCreated = 0;
  let contractsLinked = 0;

  for (const contract of contracts) {
    // Intentar buscar una cuenta de cliente existente por DNI o Email
    const dni = contract.clientDni || "DNI-PENDIENTE-" + contract.id;
    const email = contract.clientEmail || `cliente-${contract.id}@mrtechnology.com`;

    let account = await prisma.customerAccount.findFirst({
      where: {
        OR: [
          { taxId: dni },
          { email: email }
        ]
      }
    });

    // Si no existe, crear la cuenta
    if (!account) {
      account = await prisma.customerAccount.create({
        data: {
          companyName: contract.companyName || contract.clientName,
          taxId: dni,
          phone: contract.clientPhone || "Por definir",
          email: email,
          address: contract.address || "Por definir",
          city: contract.city || "Por definir",
          province: contract.province || "Por definir",
          country: contract.country || "Argentina",
          tier: contract.planType.includes("EMPRESARIAL") || contract.planType.includes("PRO") ? "ENTERPRISE" : "STANDARD",
        }
      });
      accountsCreated++;
      console.log(`✨ Cuenta creada: ${account.companyName} (${account.taxId})`);
    }

    // Vincular el contrato a la cuenta
    await prisma.installationContract.update({
      where: { id: contract.id },
      data: { accountId: account.id }
    });
    contractsLinked++;
  }

  console.log("\n✅ Migración CRM completada con éxito:");
  console.log(` - Cuentas de Cliente creadas: ${accountsCreated}`);
  console.log(` - Contratos vinculados correctamente: ${contractsLinked}`);
}

main()
  .catch((e) => {
    console.error("❌ Error en la migración CRM:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
