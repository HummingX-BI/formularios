import { useState } from 'react';
import { 
  Button, Switch, Card, KpiCard, InsightBlock, Badge, SeverityPill, 
  Avatar, Stat, Divider, SectionHeader, InfoPopover, 
  Tooltip, EmptyState, ErrorState, Skeleton, ProgressBar, Toast, 
  Select, MultiSelect, Slider, Tabs, SegmentedControl, Modal, Drawer, Table 
} from '../../ui';
import { conceptColors } from '../../ui/conceptColors';

export function DesignGallery() {
  const [loading, setLoading] = useState(false);
  const [switchVal, setSwitchVal] = useState(false);
  const [sliderVal, setSliderVal] = useState(50);
  const [tab, setTab] = useState(0);
  const [seg, setSeg] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'info'} | null>(null);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const tableData = [
    { id: 1, name: 'Mariana Ríos', role: 'Instructor', status: 'Activo' },
    { id: 2, name: 'Ricardo Gómez', role: 'Instructor', status: 'Baja' },
  ];

  return (
    <div className="p-8 bg-ice-50 min-h-screen pb-32">
      <div className="max-w-6xl mx-auto space-y-12">
        <SectionHeader 
          title="Sistema de Diseño (Premium Acuático)" 
          subtitle="Galería interactiva de tokens y componentes de UI."
        />

        {/* Tokens */}
        <section>
          <h3 className="text-xl font-bold text-navy-900 mb-4 font-jakarta border-b border-ice-100 pb-2">Paleta y Conceptos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(conceptColors).filter(([k]) => k !== 'paletaFria' && k !== 'default').map(([key, value]) => (
              <div key={key} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-ice-100">
                <div className="w-10 h-10 rounded-full" style={{ backgroundColor: value as string }}></div>
                <div>
                  <div className="font-bold text-sm text-navy-900 capitalize">{key}</div>
                  <div className="text-xs text-tenue font-mono">{value as string}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Botones */}
        <section>
          <h3 className="text-xl font-bold text-navy-900 mb-4 font-jakarta border-b border-ice-100 pb-2">Botones y Controles</h3>
          <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-xl shadow-aquatic border border-ice-100">
            <Button variant="primary">Primario</Button>
            <Button variant="secondary">Secundario</Button>
            <Button variant="ghost">Fantasma</Button>
            <Button variant="danger">Peligro</Button>
            <Button isLoading={loading} onClick={simulateLoading}>Cargando...</Button>
            <Button disabled>Deshabilitado</Button>
            
            <div className="w-px h-8 bg-ice-100 mx-2"></div>
            
            <Switch checked={switchVal} onChange={setSwitchVal} />
            <div className="w-48"><Slider value={sliderVal} onChangeValue={setSliderVal} /></div>
          </div>
        </section>

        {/* Tarjetas e Insights */}
        <section>
          <h3 className="text-xl font-bold text-navy-900 mb-4 font-jakarta border-b border-ice-100 pb-2">Tarjetas (KpiCard, InsightBlock)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KpiCard 
              title="Ingresos Mensuales" 
              value={425000} 
              isCurrency 
              variation={5.2} 
              semanticColor="positive" 
              infoText="Total facturado en el mes actual."
            />
            <KpiCard 
              title="Tasa de Deserción" 
              value={4.8} 
              unit="%" 
              variation={-1.2} 
              semanticColor="positive" 
            />
            <Card className="p-5 flex items-center justify-center bg-ice-50 border-dashed border-2">
              <span className="text-tenue font-medium">Slot Libre (Sparkline)</span>
            </Card>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InsightBlock 
              title="Alerta de Retención"
              conclusion="El Nivel 3 está experimentando una tasa de baja inusual este mes."
              whatToDo="Considera contactar a las familias del Nivel 3 para ofrecer una clase de refuerzo."
              severity="high"
              onAction={() => setToast({ msg: 'Acción agregada', type: 'success' })}
            />
            <InsightBlock 
              title="Oportunidad"
              conclusion="El grupo de sábados a las 10:00 AM está lleno pero hay alta demanda en lista de espera."
              severity="low"
            />
          </div>
        </section>

        {/* Visualización de Datos */}
        <section>
          <h3 className="text-xl font-bold text-navy-900 mb-4 font-jakarta border-b border-ice-100 pb-2">Visualización de Datos (Badge, Avatar)</h3>
          <div className="flex flex-wrap gap-6 items-center bg-white p-6 rounded-xl shadow-sm border border-ice-100">
            <div className="flex gap-2">
              <SeverityPill level="low" />
              <SeverityPill level="medium" />
              <SeverityPill level="high" />
              <SeverityPill level="critical" />
            </div>
            <Divider />
            <div className="flex gap-4">
              <Avatar name="Carlos Ruíz" size="sm" />
              <Avatar name="Mariana López" size="md" />
              <Avatar name="Zacarias Gomez" size="lg" />
            </div>
            <Divider />
            <div className="flex gap-6">
              <Stat label="Total Alumnos" value="620" />
              <Stat label="Ocupación" value="78%" />
            </div>
          </div>
        </section>

        {/* Navegación */}
        <section>
          <h3 className="text-xl font-bold text-navy-900 mb-4 font-jakarta border-b border-ice-100 pb-2">Navegación (Tabs, Segmented)</h3>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-ice-100 flex flex-col gap-6">
            <Tabs 
              tabs={['Vista General', 'Finanzas', 'Operación']} 
              activeTab={tab} 
              onChange={setTab} 
            />
            <SegmentedControl 
              options={['Diario', 'Semanal', 'Mensual']} 
              selectedIndex={seg} 
              onChange={setSeg} 
            />
          </div>
        </section>

        {/* Inputs */}
        <section>
          <h3 className="text-xl font-bold text-navy-900 mb-4 font-jakarta border-b border-ice-100 pb-2">Inputs (Select, MultiSelect)</h3>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-ice-100 flex gap-6">
            <div className="w-64">
              <label className="block text-sm font-medium text-secundario mb-1">Nivel</label>
              <Select options={[{label: 'Nivel 1', value: '1'}, {label: 'Nivel 2', value: '2'}]} />
            </div>
            <div className="w-64">
              <label className="block text-sm font-medium text-secundario mb-1">Instructores</label>
              <MultiSelect options={[{label: 'Mariana', value: '1'}, {label: 'Ricardo', value: '2'}]} />
            </div>
          </div>
        </section>

        {/* Modales y Tooltips */}
        <section>
          <h3 className="text-xl font-bold text-navy-900 mb-4 font-jakarta border-b border-ice-100 pb-2">Overlays y Feedback</h3>
          <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-xl shadow-sm border border-ice-100">
            <Button onClick={() => setModalOpen(true)}>Abrir Modal</Button>
            <Button onClick={() => setDrawerOpen(true)}>Abrir Drawer</Button>
            <Button variant="secondary" onClick={() => setToast({ msg: 'Operación exitosa', type: 'success' })}>Mostrar Toast</Button>
            
            <div className="w-px h-8 bg-ice-100 mx-2"></div>
            
            <Tooltip content="Información extra en hover">
              <span className="text-secundario cursor-help underline decoration-dashed">Pasa el ratón aquí</span>
            </Tooltip>
            
            <InfoPopover title="Métrica Compleja" description="Explicación detallada de cómo se calcula esta métrica específica para el negocio." formula="V_actual / V_pasado - 1" />
          </div>
        </section>

        {/* Tabla */}
        <section>
          <h3 className="text-xl font-bold text-navy-900 mb-4 font-jakarta border-b border-ice-100 pb-2">Tabla de Datos</h3>
          <Table 
            data={tableData} 
            columns={[
              { key: 'id', header: 'ID', sortable: true },
              { key: 'name', header: 'Nombre', sortable: true },
              { key: 'role', header: 'Rol', sortable: true },
              { key: 'status', header: 'Estado', render: (row) => <Badge color={row.status === 'Activo' ? 'bg-verde-agua text-white' : 'bg-coral text-white'}>{row.status}</Badge> }
            ]}
          />
        </section>
        
        {/* Estados */}
        <section>
          <h3 className="text-xl font-bold text-navy-900 mb-4 font-jakarta border-b border-ice-100 pb-2">Estados (Loading, Empty, Error)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmptyState title="Sin datos" description="No hay información registrada para este periodo. Intenta cambiar los filtros." action={<Button size="sm">Limpiar Filtros</Button>} />
            <ErrorState title="Error de conexión" error="No se pudo contactar con el modelo ML." onRetry={() => {}} />
            <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-ice-100">
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
              <div className="mt-4"><ProgressBar value={65} /></div>
            </div>
          </div>
        </section>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Ejemplo de Modal">
          <p className="text-secundario">Este es el contenido interno del modal animado con framer-motion. Presiona la X o el fondo oscuro para cerrar.</p>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setModalOpen(false)}>Aceptar</Button>
          </div>
        </Modal>

        <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Ejemplo de Drawer">
          <p className="text-secundario mb-4">Un panel lateral perfecto para filtros o configuraciones complejas.</p>
          <div className="space-y-4">
            <Select options={[{label: 'Opción 1', value: '1'}]} />
            <Select options={[{label: 'Opción 2', value: '2'}]} />
          </div>
        </Drawer>

        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}
