import { z } from "zod";

export const contractSchema = z.object({
  clientName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  clientEmail: z.string().email("Formato de correo electrónico inválido"),
  clientPhone: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),
  clientDni: z.string().min(2, "El DNI/CUIT es demasiado corto").max(20, "El DNI/CUIT es demasiado largo"),
  companyName: z.string().optional(),
  address: z.string().min(5, "La dirección es demasiado corta"),
  city: z.string().min(3, "Ciudad requerida"),
  province: z.string().min(3, "Provincia requerida"),
  equipmentType: z.enum(["MINI_X", "STANDARD_V4"], {
    errorMap: () => ({ message: "Seleccione un equipo válido" }),
  }),
  planType: z.string().min(1, "Seleccione un plan"),
  monthlyFee: z.string().optional(),
  installationNotes: z.string().optional(),
});



export const loginSchema = z.object({
  dni: z.string().min(1, "DNI requerido"),
  contractNumber: z.string().regex(/^(MR|SOL)[ -]\d{4}-\d{4}$/, "El formato debe ser MR-2026-0001 o SOL-2026-0001 (puedes usar espacio o guion)"),
});


export type ContractInput = z.infer<typeof contractSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
