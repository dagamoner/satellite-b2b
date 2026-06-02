import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando la limpieza de datos de prueba...');

  try {
    // 1. Delete dependent tables first
    const deletedTicketMessages = await prisma.ticketMessage.deleteMany();
    console.log(`- Eliminados ${deletedTicketMessages.count} mensajes de tickets`);

    const deletedInvoices = await prisma.invoice.deleteMany();
    console.log(`- Eliminadas ${deletedInvoices.count} facturas`);

    const deletedActivities = await prisma.clientActivity.deleteMany();
    console.log(`- Eliminadas ${deletedActivities.count} actividades de CRM`);

    const deletedTickets = await prisma.supportTicket.deleteMany();
    console.log(`- Eliminados ${deletedTickets.count} tickets de soporte`);

    // 2. Delete core tables
    const deletedContracts = await prisma.installationContract.deleteMany();
    console.log(`- Eliminados ${deletedContracts.count} contratos de instalación`);

    const deletedLeads = await prisma.lead.deleteMany();
    console.log(`- Eliminados ${deletedLeads.count} leads comerciales`);

    const deletedAccounts = await prisma.customerAccount.deleteMany();
    console.log(`- Eliminadas ${deletedAccounts.count} cuentas de cliente (CustomerAccounts)`);

    console.log('✅ Limpieza completada con éxito. Los usuarios, locaciones y salas de chat se han conservado intactos.');
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
