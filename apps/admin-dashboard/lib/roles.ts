// Helper centralizado para colores y estilos de roles
// Importar desde aquí en todos los componentes que necesiten estilos de rol

export const ROLE_CONFIG: Record<string, {
  label: string;
  badgeClass: string;
  avatarClass: string;
  navBadgeClass: string;
}> = {
  ADMIN: {
    label: "Admin",
    badgeClass: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    avatarClass: "bg-cyan-500/10 text-cyan-500",
    navBadgeClass: "bg-cyan-500/20 text-cyan-400",
  },
  CEO: {
    label: "CEO",
    badgeClass: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
    avatarClass: "bg-violet-500/10 text-violet-500",
    navBadgeClass: "bg-violet-500/20 text-violet-400",
  },
  TECH: {
    label: "Técnico",
    badgeClass: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    avatarClass: "bg-amber-500/10 text-amber-500",
    navBadgeClass: "bg-amber-500/20 text-amber-400",
  },
  SALES: {
    label: "Ventas",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    avatarClass: "bg-emerald-500/10 text-emerald-500",
    navBadgeClass: "bg-emerald-500/20 text-emerald-400",
  },
  MARKETING: {
    label: "Marketing",
    badgeClass: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
    avatarClass: "bg-pink-500/10 text-pink-500",
    navBadgeClass: "bg-pink-500/20 text-pink-400",
  },
  AGENT: {
    label: "Agente Oficial",
    badgeClass: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
    avatarClass: "bg-orange-500/10 text-orange-500",
    navBadgeClass: "bg-orange-500/20 text-orange-400",
  },
};

export function getRoleConfig(role: string) {
  return ROLE_CONFIG[role] ?? {
    label: role,
    badgeClass: "bg-slate-700 text-slate-400 border border-white/5",
    avatarClass: "bg-slate-800 text-slate-400",
    navBadgeClass: "bg-slate-700 text-slate-400",
  };
}
