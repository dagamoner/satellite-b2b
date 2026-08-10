import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("--- SEMBRADO DE CHAT STAFF INTERNO ---");

  // Buscar usuarios
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" }
  });

  const tech = await prisma.user.findFirst({
    where: { role: "TECH" }
  });

  if (!admin || !tech) {
    console.log("❌ No se encontraron usuarios ADMIN y TECH para sembrar mensajes. Crea usuarios en la plataforma primero.");
    return;
  }

  console.log(`✅ ADMIN encontrado: ${admin.name} (${admin.email})`);
  console.log(`✅ TECH encontrado: ${tech.name} (${tech.email})`);

  // Limpiar mensajes internos preexistentes
  await prisma.internalMessage.deleteMany({});
  console.log("🧹 Mensajes internos anteriores limpiados.");

  // Mensajes simulados de operaciones
  const messagesData = [
    {
      content: "¡Hola equipo! Iniciamos el canal de coordinación general staff en este módulo. Por favor, reporten cualquier novedad operativa o de soporte directamente aquí.",
      senderId: admin.id,
      createdAt: new Date(Date.now() - 3600000 * 2) // Hace 2 horas
    },
    {
      content: "Copiado. Estoy en viaje hacia la instalación del nodo norte. Clima despejado, estimo arribo en 30 minutos.",
      senderId: tech.id,
      createdAt: new Date(Date.now() - 3600000) // Hace 1 hora
    },
    {
      content: "Excelente. Por favor, avísame cuando tengas la antena Starlink apuntada para que revisemos telemetría y latencia desde la consola NOC.",
      senderId: admin.id,
      createdAt: new Date(Date.now() - 1800000) // Hace 30 min
    },
    {
      content: "Nodo Norte operativo y alineado. Señal -82dBm estables y 42ms de latencia. Todo listo en el sector.",
      senderId: tech.id,
      createdAt: new Date(Date.now() - 300000) // Hace 5 min
    }
  ];

  for (const msg of messagesData) {
    await prisma.internalMessage.create({
      data: msg
    });
  }

  console.log("🎉 Se han sembrado 4 mensajes de chat interno con éxito.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
