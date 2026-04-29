import { z } from "zod";

export const contractSchema = z.object({
  clientName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  clientEmail: z.string().email("Formato de correo electrónico inválido"),
  clientPhone: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),
  clientDni: z.string().regex(/^[0-9]{7,11}$/, "El DNI/CUIT debe tener entre 7 y 11 números, sin puntos ni guiones"),
  companyName: z.string().optional(),
  address: z.string().min(5, "La dirección es demasiado corta"),
  city: z.string().min(3, "Ciudad requerida"),
  province: z.string().min(3, "Provincia requerida"),
  equipmentType: z.enum(["MINI_X", "STANDARD_V4"], {
    errorMap: () => ({ message: "Seleccione un equipo válido" }),
  }),
  planType: z.string().min(1, "Seleccione un plan"),
  installationNotes: z.string().optional(),
});

export const loginSchema = z.object({
  dni: z.string().min(1, "DNI requerido"),
  contractNumber: z.string().regex(/^MR-\d{4}-\d{4}$/, "El formato debe ser MR-YYYY-XXXX (Ej: MR-2026-0001)"),
});

export type ContractInput = z.infer<typeof contractSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
