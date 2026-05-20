import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@repo/database";
import { cookies } from "next/headers";
import { checkRole } from "../../../../lib/rbac";

export const dynamic = "force-dynamic";

export async function GET() {
  const { authorized, error } = await checkRole(["ADMIN", "SALES"]);
  if (error) return error;
  
  try {
    // 1. Sales Metrics
    const totalContracts = await db.installationContract.count();
    const leadsCount = await db.installationContract.count({ where: { status: "LEAD" } });
    const completedCount = await db.installationContract.count({ where: { status: "COMPLETED" } });
    const inProgressCount = await db.installationContract.count({ where: { status: "IN_PROGRESS" } });
    
    const totalMonthlyFee = await db.installationContract.aggregate({
      _sum: { monthlyFee: true },
      where: { status: "COMPLETED" }
    });

    // 2. Ticket Metrics
    const totalTickets = await db.supportTicket.count();
    const openTickets = await db.supportTicket.count({ where: { status: "OPEN" } });
    const closedTickets = await db.supportTicket.count({ where: { status: "CLOSED" } });
    // Simulate "In Progress" as tickets with more than 1 staff message or high priority
    const inProgressTickets = await db.supportTicket.count({ 
      where: { 
        status: "OPEN",
        messages: { some: { authorId: { not: null } } }
      } 
    });

    // 3. Technician Performance (KPIs)
    const technicians = await db.user.findMany({
      where: { role: "TECH" },
      select: {
        id: true,
        name: true,
        contracts: {
          where: { status: "COMPLETED" },
          select: {
            downloadSpeed: true,
            uploadSpeed: true,
            latency: true,
          }
        },
        _count: {
          select: {
            contracts: { where: { status: "IN_PROGRESS" } }
          }
        }
      }
    });

    const techKPIs = technicians.map(tech => {
      const completedInstalls = tech.contracts.length;
      const inProgressInstalls = tech._count.contracts;
      const avgDownload = completedInstalls > 0 
        ? tech.contracts.reduce((acc, curr) => acc + (curr.downloadSpeed || 0), 0) / completedInstalls 
        : 0;
      const avgUpload = completedInstalls > 0 
        ? tech.contracts.reduce((acc, curr) => acc + (curr.uploadSpeed || 0), 0) / completedInstalls 
        : 0;
      const avgLatency = completedInstalls > 0 
        ? tech.contracts.reduce((acc, curr) => acc + (curr.latency || 0), 0) / completedInstalls 
        : 0;

      return {
        id: tech.id,
        name: tech.name,
        completedInstalls,
        inProgressInstalls,
        avgDownload: avgDownload.toFixed(2),
        avgUpload: avgUpload.toFixed(2),
        avgLatency: avgLatency.toFixed(2),
        // OKR Score (Example: target 10 installs per month, current ratio)
        okrScore: Math.min(100, (completedInstalls / 10) * 100).toFixed(0)
      };
    });

    // 4. Sales KPIs (Popular plans)
    const plansRaw = await db.installationContract.groupBy({
      by: ['planType'],
      _count: { _all: true },
      where: { status: "COMPLETED" }
    });

    const plansMetrics = plansRaw.map(p => ({
      name: p.planType,
      count: p._count._all
    }));

    return NextResponse.json({
      sales: {
        totalContracts,
        leadsCount,
        completedCount,
        inProgressCount,
        approvedCount: await db.installationContract.count({ where: { status: "APPROVED" } }),
        conversionRate: totalContracts > 0 ? ((completedCount / totalContracts) * 100).toFixed(1) : 0,
        totalRevenue: totalMonthlyFee._sum.monthlyFee || 0
      },
      tickets: {
        total: totalTickets,
        open: openTickets - inProgressTickets,
        inProgress: inProgressTickets,
        closed: closedTickets,
        completionRate: totalTickets > 0 ? ((closedTickets / totalTickets) * 100).toFixed(1) : 0
      },
      technicians: techKPIs,
      plans: plansMetrics
    });

  } catch (error) {
    console.error("[METRICS_API] Error:", error);
    return NextResponse.json({ error: "Error al calcular métricas" }, { status: 500 });
  }
}
