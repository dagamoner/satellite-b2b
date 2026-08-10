
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  try {
    const contracts = await prisma.installationContract.findMany();
    console.log("Contratos encontrados:", contracts.length);
    contracts.forEach(c => {
      console.log(`- Contrato: ${c.contractNumber}, DNI: ${c.clientDni}, ID: ${c.id}`);
    });

    const users = await prisma.user.findMany();
    console.log("Usuarios técnicos:", users.length);
    users.forEach(u => {
      console.log(`- Email: ${u.email}, Rol: ${u.role}`);
    });
  } catch (err) {
    console.error("Error consultando DB:", err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
