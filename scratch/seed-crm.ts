import { prisma } from "@repo/database";

async function main() {
  console.log("🌱 Iniciando siembra de datos de prueba para el CRM...");

  // 1. Obtener todos los usuarios y crear un usuario de Ventas si no existe
  let users = await prisma.user.findMany();
  if (users.length === 0) {
    // Si por alguna razón no hay usuarios, creamos uno de prueba
    const admin = await prisma.user.create({
      data: {
        name: "Administrador de Pruebas",
        email: "admin@mrtechnology.com",
        role: "ADMIN",
      }
    });
    users.push(admin);
  }

  let salesUser = users.find(u => u.role === "SALES");
  if (!salesUser) {
    salesUser = await prisma.user.create({
      data: {
        name: "Valeria Gómez (Ventas)",
        email: "valeria.sales@mrtechnology.com",
        role: "SALES",
      }
    });
    users.push(salesUser);
    console.log(`✨ Usuario de Ventas creado: ${salesUser.name}`);
  }

  const assignedUser = salesUser || users[0];

  // 2. Obtener cuentas de cliente existentes
  const accounts = await prisma.customerAccount.findMany();
  console.log(`📋 Se encontraron ${accounts.length} cuentas de cliente.`);

  if (accounts.length === 0) {
    console.log("❌ No hay cuentas de cliente en el sistema. Ejecute primero la migración.");
    return;
  }

  // 3. Crear Leads realistas de Mendoza y zonas de minería/agro de Argentina
  const leadsData = [
    {
      leadNumber: "L-10021",
      clientName: "Ing. Carlos Mendoza",
      companyName: "Minera Del Sol S.A.",
      email: "carlos.mendoza@mineradosol.com",
      phone: "+54 9 261 445-8932",
      source: "WEB_MARKETING",
      status: "FEASIBILITY",
      latitude: -32.89084,
      longitude: -68.82717,
      notes: "Solicita viabilidad de enlace Starlink de alta capacidad para campamento minero en Alta Montaña.",
    },
    {
      leadNumber: "L-10022",
      clientName: "María Inés Estévez",
      companyName: "Estancia El Ombú",
      email: "maria.estevez@ombuagro.com",
      phone: "+54 9 261 332-1144",
      source: "REFERRAL",
      status: "NEW",
      latitude: -34.62001,
      longitude: -68.32001,
      notes: "Contacto de recomendación por el plan de agro. Zonas sin cobertura celular en San Rafael.",
    },
    {
      leadNumber: "L-10023",
      clientName: "Juan Pablo Rossi",
      companyName: "Logística Los Andes",
      email: "jprossi@losandeslogistica.com.ar",
      phone: "+54 9 261 654-7890",
      source: "MANUAL",
      status: "CONTACTED",
      latitude: -32.92004,
      longitude: -68.85002,
      notes: "Interesado en Starlink Flat High Performance para 3 camiones de larga distancia.",
    },
    {
      leadNumber: "L-10024",
      clientName: "Dra. Sofía Ortega",
      companyName: "Clínica San Javier (Uspallata)",
      email: "sortega@clinicasanjavier.com",
      phone: "+54 9 261 112-2334",
      source: "WEB_MARKETING",
      status: "WON",
      latitude: -32.59544,
      longitude: -69.34582,
      notes: "Enlace ya instalado y funcionando correctamente. Cliente muy conforme.",
    },
    {
      leadNumber: "L-10025",
      clientName: "Federico Albarracín",
      companyName: "Bodega Altus Premium",
      email: "falbarracin@altuswines.com",
      phone: "+54 9 261 887-7665",
      source: "WEB_MARKETING",
      status: "FEASIBILITY",
      latitude: -33.56041,
      longitude: -69.12001,
      notes: "Requiere Internet satelital para área de turismo en Valle de Uco.",
    }
  ];

  let leadsCreated = 0;
  for (const leadData of leadsData) {
    // Evitar duplicados por leadNumber
    const existing = await prisma.lead.findUnique({
      where: { leadNumber: leadData.leadNumber }
    });
    if (!existing) {
      await prisma.lead.create({
        data: {
          ...leadData,
          assignedToId: assignedUser.id,
        }
      });
      leadsCreated++;
    }
  }
  console.log(`✨ Se crearon ${leadsCreated} nuevos leads.`);

  // 4. Crear Actividades de Cliente e Historial de Contacto
  const leads = await prisma.lead.findMany();
  let activitiesCreated = 0;

  for (const lead of leads) {
    const existingActivities = await prisma.clientActivity.findFirst({
      where: { leadId: lead.id }
    });

    if (!existingActivities) {
      // Actividad 1: Llamada inicial
      await prisma.clientActivity.create({
        data: {
          type: "CALL",
          title: "Llamada inicial de calificación",
          description: `Se contactó al cliente por teléfono. Comenta que tiene urgencia debido al inicio de la temporada. Nota del lead: ${lead.notes}`,
          createdById: assignedUser.id,
          leadId: lead.id,
        }
      });

      // Actividad 2: Viabilidad NOC si está en viabilidad
      if (lead.status === "FEASIBILITY") {
        await prisma.clientActivity.create({
          data: {
            type: "NOC_SYSTEM",
            title: "Verificación de Telemetría y Línea de Vista (NOC)",
            description: `Se validaron las coordenadas satelitales (Lat: ${lead.latitude}, Long: ${lead.longitude}). Órbita despejada para Starlink Business. Obstrucción estimada: 0%.`,
            createdById: assignedUser.id,
            leadId: lead.id,
          }
        });
      }
      activitiesCreated += lead.status === "FEASIBILITY" ? 2 : 1;
    }
  }

  // Actividades para las Cuentas de Cliente existentes
  for (const account of accounts) {
    const existingActivities = await prisma.clientActivity.findFirst({
      where: { accountId: account.id }
    });

    if (!existingActivities) {
      await prisma.clientActivity.create({
        data: {
          type: "NOTE",
          title: "Cuenta configurada en CRM",
          description: `Relación iniciada a partir de los contratos preexistentes. Nivel de servicio: ${account.tier}. Se actualizó la información de contacto corporativa.`,
          createdById: assignedUser.id,
          accountId: account.id,
        }
      });
      activitiesCreated++;
    }
  }
  console.log(`✨ Se crearon ${activitiesCreated} actividades de contacto.`);

  // 5. Crear Facturas/Cobros informativos vinculados a las cuentas de cliente
  let invoicesCreated = 0;
  for (const account of accounts) {
    const existingInvoices = await prisma.invoice.findFirst({
      where: { accountId: account.id }
    });

    if (!existingInvoices) {
      // Factura 1: Pagada (Mes anterior)
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      await prisma.invoice.create({
        data: {
          invoiceNumber: `FACT-${account.companyName.substring(0, 3).toUpperCase()}-${account.taxId.substring(0, 4)}-2604`,
          amount: account.tier === "ENTERPRISE" ? 180000.0 : 85000.0,
          currency: "ARS",
          dueDate: lastMonth,
          status: "PAID",
          paymentMethod: "TRANSFER",
          paidAt: lastMonth,
          pdfUrl: "/uploads/invoices/mock-paid.pdf",
          accountId: account.id,
        }
      });

      // Factura 2: Pendiente (Mes actual)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      await prisma.invoice.create({
        data: {
          invoiceNumber: `FACT-${account.companyName.substring(0, 3).toUpperCase()}-${account.taxId.substring(0, 4)}-2605`,
          amount: account.tier === "ENTERPRISE" ? 180000.0 : 85000.0,
          currency: "ARS",
          dueDate: nextWeek,
          status: "UNPAID",
          accountId: account.id,
        }
      });

      invoicesCreated += 2;
    }
  }
  console.log(`✨ Se crearon ${invoicesCreated} facturas informativas.`);

  console.log("\n✅ Siembra de datos del CRM completada correctamente.");
}

main()
  .catch((e) => {
    console.error("❌ Error en la siembra CRM:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
