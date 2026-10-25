import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const LEGACY_ROUTES: Record<string, string> = {
  '/c01/m1-1': '/mando/resumen',
  '/c01/m1-2': '/mando/salud?tab=indice',
  '/c01/m1-3': '/mando/alertas?tab=alertas',
  '/c01/m1-4': '/config/reportes',
  '/c02/m2-1': '/alumnos/expediente?tab=perfil',
  '/c02/m2-2': '/alumnos/inscripciones?tab=cupos',
  '/c02/m2-3': '/alumnos/horarios',
  '/c02/m2-4': '/alumnos/asistencia?tab=pase-lista',
  '/c02/m2-5': '/alumnos/asistencia?tab=kardex',
  '/c02/m2-6': '/alumnos/inscripciones?tab=espera',
  '/c02/m2-7': '/alumnos/expediente?tab=credencial',
  '/c03/m3-1': '/equipo/directorio',
  '/c03/m3-2': '/equipo/nomina',
  '/c03/m3-3': '/equipo/desempeno?tab=ficha',
  '/c04/m4-1': '/finanzas/cobro',
  '/c04/m4-2': '/finanzas/cobranza?tab=deudores',
  '/c04/m4-3': '/finanzas/cobranza?tab=antiguedad',
  '/c04/m4-4': '/finanzas/rentabilidad?tab=cfo',
  '/c04/m4-5': '/finanzas/ltv',
  '/c04/m4-6': '/finanzas/rentabilidad?tab=hora-carril',
  '/c05/m5-1': '/ventas/crm?tab=pipeline',
  '/c05/m5-2': '/ventas/embudo?tab=embudo',
  '/c05/m5-3': '/ventas/embudo?tab=motivos',
  '/c05/m5-4': '/ventas/canales?tab=retorno',
  '/c05/m5-5': '/ventas/crm?tab=agente',
  '/c06/m6-1': '/capacidad/ocupacion',
  '/c06/m6-2': '/capacidad/oportunidades',
  '/c06/m6-3': '/capacidad/optimizador',
  '/c06/m6-4': '/capacidad/simulador',
  '/c07/m7-1': '/retencion/riesgo?tab=riesgo',
  '/c07/m7-2': '/retencion/lealtad?tab=ciclo',
  '/c07/m7-3': '/retencion/lealtad?tab=cohortes',
  '/c07/m7-4': '/retencion/bajas',
  '/c07/m7-5': '/retencion/riesgo?tab=plan',
  '/c08/m8-1': '/alumnos/niveles?tab=flujo',
  '/c08/m8-2': '/alumnos/niveles?tab=tiempo',
  '/c08/m8-3': '/equipo/desempeno?tab=comparativa',
  '/c09/m9-1': '/mando/salud?tab=metas',
  '/c09/m9-2': '/inteligencia/laboratorio?tab=percentiles',
  '/c09/m9-3': '/inteligencia/laboratorio?tab=binomial',
  '/c09/m9-4': '/inteligencia/porque',
  '/c09/m9-5': '/inteligencia/laboratorio?tab=inferencia',
  '/c09/m9-6': '/inteligencia/laboratorio?tab=correlaciones',
  '/c09/m9-7': '/inteligencia/pronostico?tab=corto',
  '/c09/m9-8': '/inteligencia/laboratorio?tab=series',
  '/c10/m10-1': '/inteligencia/pronostico?tab=confiabilidad',
  '/c10/m10-2': '/retencion/segmentacion',
  '/c10/m10-3': '/inteligencia/pronostico?tab=seis-meses',
  '/c10/m10-4': '/inteligencia/simulador?tab=montecarlo',
  '/c11/m11-1': '/mando/alertas?tab=recomendaciones',
  '/c11/m11-2': '/inteligencia/simulador?tab=escenarios',
  '/c11/m11-3': '/mando/plan',
  '/c12/m12-1': '/inteligencia/asistente?tab=chat',
  '/c12/m12-2': '/inteligencia/asistente?tab=glosario',
  '/c13/m13-1': '/ventas/canales?tab=web',
  '/c13/m13-2': '/ventas/campanas',
  '/c13/m13-3': '/config/comercial',
  '/c13/m13-4': '/config/demo',
  '/c13/m13-5': '/config/entorno'
};

export const LegacyRedirect: React.FC = () => {
  const location = useLocation();
  const target = LEGACY_ROUTES[location.pathname];
  
  if (target) {
    const [path, search] = target.split('?');
    const newSearch = new URLSearchParams(location.search);
    if (search) {
      const targetParams = new URLSearchParams(search);
      targetParams.forEach((value, key) => {
        newSearch.set(key, value);
      });
    }
    const finalSearch = newSearch.toString();
    return <Navigate to={`${path}${finalSearch ? `?${finalSearch}` : ''}`} replace />;
  }
  
  return <Navigate to="/mando/resumen" replace />;
};
