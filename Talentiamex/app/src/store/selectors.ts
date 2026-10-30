import { META_CANDIDATOS, META_EMPRESAS } from '@/data/config';
import { diasEntre, sumarDias } from '@/lib/fechas';
import type { Empresa, SectorId } from '@/types';
import type { DatosDemo } from './useDemoStore';

/*
 * Cálculos puros sobre el estado. En componentes, envuélvelos con `useShallow`
 * (zustand/react/shallow) cuando devuelvan objetos o listas nuevas.
 */

export interface KpisEmpresa {
  vacantesActivas: number;
  postulantesNuevos: number;
  preseleccionados: number;
  /** Días que le quedan a la prueba o al plan; null si aún no tiene plan. */
  diasPlan: number | null;
  estadoPlan: Empresa['plan']['estado'];
}

export function kpisEmpresa(s: DatosDemo, empresaId: string): KpisEmpresa {
  const empresa = s.empresas.find((e) => e.id === empresaId);
  const vacantes = s.vacantes.filter((v) => v.empresaId === empresaId);
  const ids = new Set(vacantes.map((v) => v.id));
  const postulaciones = s.postulaciones.filter((p) => ids.has(p.vacanteId));
  const plan = empresa?.plan;
  return {
    vacantesActivas: vacantes.filter((v) => v.estado === 'activa').length,
    postulantesNuevos: postulaciones.filter((p) => p.estado === 'enviada').length,
    preseleccionados: postulaciones.filter((p) => p.estado === 'preseleccionado').length,
    diasPlan:
      plan && (plan.estado === 'prueba' || plan.estado === 'activo')
        ? diasEntre(s.hoy, plan.venceEl)
        : null,
    estadoPlan: plan?.estado ?? 'sin_plan',
  };
}

/** Postulantes que aún no se revisan en una vacante. */
export function postulantesNuevosDeVacante(s: DatosDemo, vacanteId: string): number {
  return s.postulaciones.filter((p) => p.vacanteId === vacanteId && p.estado === 'enviada').length;
}

export interface KpisAdmin {
  empresasActivas: number;
  metaEmpresas: number;
  candidatosActivos: number;
  metaCandidatos: number;
  vacantesActivas: number;
  postulacionesSemana: number;
  cvDescargados: number;
  ingresos: number;
}

export function kpisAdmin(s: DatosDemo): KpisAdmin {
  const activo = (id: string): boolean => !s.suspendidos.includes(id);
  const desde = sumarDias(s.hoy, -6);
  return {
    empresasActivas: s.empresas.filter((e) => e.plan.estado === 'activo' && activo(e.id)).length,
    metaEmpresas: META_EMPRESAS,
    candidatosActivos: s.candidatos.filter((c) => activo(c.id)).length,
    metaCandidatos: META_CANDIDATOS,
    vacantesActivas: s.vacantes.filter((v) => v.estado === 'activa' && activo(v.id)).length,
    postulacionesSemana: s.postulaciones.filter((p) => p.fecha >= desde && p.fecha <= s.hoy).length,
    cvDescargados: s.candidatos.filter((c) => c.cvPagado).length,
    ingresos: s.ingresos.reduce((suma, i) => suma + i.monto, 0),
  };
}

export interface PostulacionesDia {
  fecha: string;
  total: number;
}

/** Postulaciones por día de los últimos 14 días, de la más antigua a la de hoy. */
export function postulacionesPorDia(s: DatosDemo): PostulacionesDia[] {
  return Array.from({ length: 14 }, (_, i) => {
    const fecha = sumarDias(s.hoy, i - 13);
    return { fecha, total: s.postulaciones.filter((p) => p.fecha === fecha).length };
  });
}

export interface ResumenSector {
  sector: SectorId;
  nombre: string;
  candidatos: number;
  vacantes: number;
  postulaciones: number;
}

export function resumenPorSector(s: DatosDemo): ResumenSector[] {
  return s.sectores.map((sec) => {
    const idsVacantes = new Set(s.vacantes.filter((v) => v.sector === sec.id).map((v) => v.id));
    return {
      sector: sec.id,
      nombre: sec.nombre,
      candidatos: s.candidatos.filter((c) => c.sector === sec.id).length,
      vacantes: idsVacantes.size,
      postulaciones: s.postulaciones.filter((p) => idsVacantes.has(p.vacanteId)).length,
    };
  });
}
