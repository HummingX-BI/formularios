import { fechaCorta } from '@/lib/formato';
import type { PostulacionesDia, ResumenSector } from '@/store/selectors';
import type { Sector } from '@/types';

/** Sube el máximo a un número redondo para que el eje se lea fácil. */
function maximoRedondo(max: number): number {
  if (max <= 4) return 4;
  if (max <= 10) return Math.ceil(max / 2) * 2;
  return Math.ceil(max / 5) * 5;
}

interface PorDiaProps {
  datos: PostulacionesDia[];
}

/** Barras de postulaciones por día (últimos 14 días), dibujadas con SVG. */
export function GraficaPorDia({ datos }: PorDiaProps) {
  const ancho = 700;
  const alto = 260;
  const margen = { izq: 34, der: 8, sup: 18, inf: 44 };
  const util = { w: ancho - margen.izq - margen.der, h: alto - margen.sup - margen.inf };
  const tope = maximoRedondo(Math.max(0, ...datos.map((d) => d.total)));
  const paso = util.w / Math.max(1, datos.length);
  const grosor = Math.min(32, paso * 0.62);
  const y = (valor: number) => margen.sup + util.h - (valor / tope) * util.h;
  const marcas = [0, tope / 2, tope];
  const total = datos.reduce((suma, d) => suma + d.total, 0);

  return (
    <figure>
      <svg
        viewBox={`0 0 ${ancho} ${alto}`}
        role="img"
        aria-label={`Postulaciones por día de los últimos 14 días: ${total} en total`}
        className="h-auto w-full"
      >
        {marcas.map((m) => (
          <g key={m}>
            <line
              x1={margen.izq}
              x2={ancho - margen.der}
              y1={y(m)}
              y2={y(m)}
              className={m === 0 ? 'stroke-texto-3' : 'stroke-borde'}
              strokeWidth={1}
            />
            <text
              x={margen.izq - 8}
              y={y(m) + 4}
              textAnchor="end"
              className="fill-texto-2 text-[12px]"
            >
              {m}
            </text>
          </g>
        ))}
        {datos.map((d, i) => {
          const x = margen.izq + paso * i + (paso - grosor) / 2;
          const [dia = '', mes = ''] = fechaCorta(d.fecha).split(' ');
          const cambioDeMes = i === 0 || dia === '1';
          return (
            <g key={d.fecha}>
              <rect
                x={x}
                y={y(d.total)}
                width={grosor}
                height={Math.max(0, margen.sup + util.h - y(d.total))}
                rx={4}
                className="fill-marca"
              >
                <title>{`${fechaCorta(d.fecha)}: ${d.total}`}</title>
              </rect>
              {d.total > 0 && (
                <text
                  x={x + grosor / 2}
                  y={y(d.total) - 5}
                  textAnchor="middle"
                  className="fill-texto text-[12px] font-semibold"
                >
                  {d.total}
                </text>
              )}
              <text
                x={x + grosor / 2}
                y={margen.sup + util.h + 18}
                textAnchor="middle"
                className="fill-texto-2 text-[12px]"
              >
                {dia}
              </text>
              {cambioDeMes && (
                <text
                  x={x + grosor / 2}
                  y={margen.sup + util.h + 34}
                  textAnchor="middle"
                  className="fill-texto-2 text-[11px] uppercase"
                >
                  {mes}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <table className="sr-only">
        <caption>Postulaciones por día</caption>
        <tbody>
          {datos.map((d) => (
            <tr key={d.fecha}>
              <th scope="row">{fechaCorta(d.fecha)}</th>
              <td>{d.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

interface PorSectorProps {
  datos: ResumenSector[];
  sectores: Sector[];
}

/** Barras horizontales de candidatos por sector, con el color de cada sector. */
export function GraficaPorSector({ datos, sectores }: PorSectorProps) {
  const max = Math.max(1, ...datos.map((d) => d.candidatos));
  const ancho = 360;
  const fila = 78;
  const largoMax = ancho - 40;
  const alto = fila * datos.length;

  return (
    <figure>
      <svg
        viewBox={`0 0 ${ancho} ${alto}`}
        role="img"
        aria-label="Candidatos por sector"
        className="h-auto w-full"
      >
        {datos.map((d, i) => {
          const color = sectores.find((s) => s.id === d.sector)?.color ?? 'var(--color-marca)';
          const largo = Math.max(3, (largoMax * d.candidatos) / max);
          const y = i * fila;
          return (
            <g key={d.sector}>
              <text x={0} y={y + 16} className="fill-texto text-[15px] font-semibold">
                {d.nombre}
              </text>
              <text x={0} y={y + 34} className="fill-texto-2 text-[12.5px]">
                {`${d.vacantes} vacantes · ${d.postulaciones} postulaciones`}
              </text>
              <rect x={0} y={y + 44} width={largo} height={22} rx={5} fill={color}>
                <title>{`${d.nombre}: ${d.candidatos} candidatos`}</title>
              </rect>
              <text x={largo + 8} y={y + 61} className="fill-texto text-[15px] font-semibold">
                {d.candidatos}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
