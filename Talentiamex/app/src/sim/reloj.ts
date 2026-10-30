import type { AvisoDias, Empresa, PlanId, Vacante } from '@/types';
import { diasEntre, sumarDias } from '@/lib/fechas';
import { avisosPendientes, diasRestantes } from '@/store/reglas';

/** RN-09: días antes del vencimiento del plan o la prueba en que se avisa. */
export const DIAS_AVISO_PLAN = 3;

export interface EstadoReloj {
  hoy: string;
  vacantes: Vacante[];
  empresas: Empresa[];
  /** Empresa → fecha de vencimiento ya avisada (RNF-07: no duplicar RN-09). */
  avisosPlan: Record<string, string>;
}

export type EventoReloj =
  | { regla: 'RN-06'; fecha: string; empresaId: string; vacanteId: string; dias: AvisoDias }
  | { regla: 'RN-09'; fecha: string; empresaId: string; planId: PlanId };

export interface ResultadoReloj {
  estado: EstadoReloj;
  eventos: EventoReloj[];
}

/** Avanza un día: vence lo que toca y dispara RN-06 y RN-09 una sola vez. */
export function avanzarUnDia(e: EstadoReloj): ResultadoReloj {
  const hoy = sumarDias(e.hoy, 1);
  const eventos: EventoReloj[] = [];

  const vacantes = e.vacantes.map((v) => {
    if (v.estado !== 'activa') return v;
    const avisos = avisosPendientes(v, hoy);
    for (const dias of avisos) {
      eventos.push({ regla: 'RN-06', fecha: hoy, empresaId: v.empresaId, vacanteId: v.id, dias });
    }
    const actual = { ...v, avisosEnviados: [...v.avisosEnviados, ...avisos] };
    return diasRestantes(actual, hoy) < 0 ? { ...actual, estado: 'vencida' as const } : actual;
  });

  const avisosPlan = { ...e.avisosPlan };
  const empresas = e.empresas.map((emp) => {
    if (emp.plan.estado !== 'prueba' && emp.plan.estado !== 'activo') return emp;
    const dias = diasEntre(hoy, emp.plan.venceEl);
    if (dias < 0) return { ...emp, plan: { ...emp.plan, estado: 'vencido' as const } };
    if (dias <= DIAS_AVISO_PLAN && avisosPlan[emp.id] !== emp.plan.venceEl) {
      avisosPlan[emp.id] = emp.plan.venceEl;
      eventos.push({ regla: 'RN-09', fecha: hoy, empresaId: emp.id, planId: emp.plan.id });
    }
    return emp;
  });

  return { estado: { hoy, vacantes, empresas, avisosPlan }, eventos };
}

/** Avanza `n` días, día por día, juntando los eventos en orden. */
export function avanzarDias(e: EstadoReloj, n: number): ResultadoReloj {
  let estado = e;
  const eventos: EventoReloj[] = [];
  for (let i = 0; i < n; i++) {
    const r = avanzarUnDia(estado);
    estado = r.estado;
    eventos.push(...r.eventos);
  }
  return { estado, eventos };
}
