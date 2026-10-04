import { useState } from 'react';
import { Card } from '@/ui/components/Cards';
import { Button } from '@/ui/components/Buttons';
import { Select } from '@/ui/components/Inputs';
import { Tabs } from '@/ui/components/Navigation';
import { useDataset } from '@/data/hooks';
import { useAppStore } from '@/app/store';
import { formatCurrency } from '@/insights/templates';

export default function M2_2_Enrollment() {
  const dataset = useDataset();
  const store = useAppStore();
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const activeTab = ['nueva', 'reinscripcion', 'muestra', 'reposicion'][activeTabIdx];
  const [step, setStep] = useState(1);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    tutor: '',
    telefono: '',
    plan: '2clases',
    grupo: '',
    descuento: 'ninguno',
  });

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  const plans = [
    { label: '1 Clase / Semana ($1,100)', value: '1clase', price: 1100 },
    { label: '2 Clases / Semana ($1,850)', value: '2clases', price: 1850 },
    { label: '3 Clases / Semana ($2,400)', value: '3clases', price: 2400 },
  ];

  const groups = dataset.groups
    .filter((g) => g.pool === 'infantil' || g.pool === 'principal')
    .slice(0, 10)
    .map((g) => ({
      label: `${g.timeSlot} - Alberca ${g.pool} (Cupos: ${g.capacity - Math.floor(g.capacity * 0.8)})`,
      value: g.id,
    }));

  const subtotal = plans.find((p) => p.value === formData.plan)?.price || 0;
  const inscripcion = 500;
  const discountMultiplier = formData.descuento === 'trimestral' ? 0.9 : 1;
  const total =
    (subtotal * (formData.descuento === 'trimestral' ? 3 : 1) + inscripcion) * discountMultiplier;

  const handleConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      setConfirmed(true);
      // Simulate adding to store
      store.addPlanAction({ type: 'enrollment', studentName: formData.nombre, amount: total });
    }, 1500);
  };

  const renderNewEnrollment = () => {
    if (confirmed) {
      return (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-navy-900 mb-2">¡Inscripción Confirmada!</h2>
          <p className="text-secundario mb-8">
            El alumno {formData.nombre} ha sido inscrito en el sistema de sesión.
          </p>
          <div className="bg-ice-50 p-6 rounded text-left max-w-sm mx-auto mb-8 border border-ice-100">
            <h4 className="font-bold text-navy-900 mb-4 border-b pb-2">Comprobante de Pago</h4>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-secundario">Inscripción</span>
              <span>{formatCurrency(inscripcion)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-secundario">
                Plan {formData.descuento === 'trimestral' ? 'Trimestral' : 'Mensual'}
              </span>
              <span>
                {formatCurrency(subtotal * (formData.descuento === 'trimestral' ? 3 : 1))}
              </span>
            </div>
            {formData.descuento === 'trimestral' && (
              <div className="flex justify-between text-sm text-green-600 mb-2">
                <span>Descuento 10%</span>
                <span>-{formatCurrency(total * 0.1)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t text-navy-900">
              <span>Total cobrado</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setConfirmed(false);
              setStep(1);
              setFormData({ ...formData, nombre: '', tutor: '' });
            }}
          >
            Inscribir a otro alumno
          </Button>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto py-8">
        {/* Stepper */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-ice-100 -z-10 -translate-y-1/2"></div>
          {['Datos Generales', 'Selección de Grupo', 'Pago y Confirmación'].map((s, i) => (
            <div key={s} className="flex flex-col items-center bg-white px-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step > i + 1 ? 'bg-aqua-500 text-white border-aqua-500' : step === i + 1 ? 'border-aqua-500 text-aqua-500 bg-white' : 'border-ice-200 text-ice-200 bg-white'}`}
              >
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className="text-xs font-bold text-navy-900 mt-2">{s}</span>
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <Card className="p-8 bg-white border border-ice-100 shadow-sm">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-navy-900 mb-4 font-jakarta">
                Datos del Alumno
              </h3>
              <div>
                <label className="block text-sm font-bold text-navy-900 mb-1">
                  Nombre Completo del Alumno
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-ice-200 rounded focus:border-aqua-500 outline-none"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej. Mateo Gómez"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-navy-900 mb-1">Edad</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-ice-200 rounded focus:border-aqua-500 outline-none"
                  value={formData.edad}
                  onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                  placeholder="Ej. 6"
                />
              </div>
              <div className="border-t pt-4 mt-4 border-ice-100">
                <h3 className="text-xl font-bold text-navy-900 mb-4 font-jakarta">
                  Datos del Tutor
                </h3>
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-1">
                    Nombre del Tutor
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-ice-200 rounded focus:border-aqua-500 outline-none"
                    value={formData.tutor}
                    onChange={(e) => setFormData({ ...formData, tutor: e.target.value })}
                    placeholder="Ej. Luis Gómez"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-bold text-navy-900 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-ice-200 rounded focus:border-aqua-500 outline-none"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="555 123 4567"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-navy-900 mb-4 font-jakarta">Plan y Horarios</h3>
              <div>
                <label className="block text-sm font-bold text-navy-900 mb-1">Plan de Clases</label>
                <Select
                  options={plans}
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-navy-900 mb-1">
                  Seleccionar Grupo Principal
                </label>
                <Select
                  options={groups}
                  value={formData.grupo}
                  onChange={(e) => setFormData({ ...formData, grupo: e.target.value })}
                />
                <p className="text-xs text-secundario mt-1">
                  Los grupos mostrados tienen cupo disponible basado en la ocupación real.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-navy-900 mb-4 font-jakarta">Resumen de Pago</h3>
              <div className="bg-ice-50 p-4 rounded border border-ice-100 mb-4">
                <h4 className="font-bold text-navy-900 mb-2">Promociones</h4>
                <Select
                  options={[
                    { label: 'Pago Mensual (Sin promoción)', value: 'ninguno' },
                    { label: 'Pago Trimestral (10% de descuento)', value: 'trimestral' },
                  ]}
                  value={formData.descuento}
                  onChange={(e) => setFormData({ ...formData, descuento: e.target.value })}
                />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secundario">Inscripción anual</span>
                  <span>{formatCurrency(inscripcion)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secundario">
                    Plan {plans.find((p) => p.value === formData.plan)?.label}{' '}
                    {formData.descuento === 'trimestral' ? 'x 3 meses' : ''}
                  </span>
                  <span>
                    {formatCurrency(subtotal * (formData.descuento === 'trimestral' ? 3 : 1))}
                  </span>
                </div>
                {formData.descuento === 'trimestral' && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Descuento 10%</span>
                    <span>-{formatCurrency(total * 0.1)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-ice-200 pt-2 text-lg font-bold text-navy-900 mt-2">
                  <span>Total a cobrar hoy</span>
                  <span className="text-blue-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="flex justify-between mt-6">
          <Button variant="ghost" onClick={handlePrev} disabled={step === 1 || isConfirming}>
            Atrás
          </Button>
          {step < 3 ? (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!formData.nombre || !formData.tutor}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={isConfirming}
              className="w-48 justify-center"
            >
              {isConfirming ? 'Procesando pago...' : 'Cobrar e Inscribir'}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-jakarta font-bold text-navy-900">Inscripciones y Reservas</h1>
        <p className="text-lg text-secundario mt-1">
          Alta de alumnos, reinscripciones y clases sueltas
        </p>
      </div>

      <Tabs
        tabs={[
          'Nueva Inscripción',
          'Reinscripción (1 Clic)',
          'Reserva Clase Muestra',
          'Agendar Reposición',
        ]}
        activeTab={activeTabIdx}
        onChange={setActiveTabIdx}
      />

      {activeTab === 'nueva' && renderNewEnrollment()}

      {activeTab === 'reinscripcion' && (
        <Card className="p-16 text-center bg-white">
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Reinscripción Rápida</h2>
          <p className="text-secundario mb-8 max-w-md mx-auto">
            Busca un alumno inactivo para reactivar su suscripción en un solo paso usando su método
            de pago guardado.
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="text"
              placeholder="ID o Nombre del alumno..."
              className="flex-1 px-4 py-2 border border-ice-200 rounded outline-none focus:border-aqua-500"
            />
            <Button variant="primary">Buscar</Button>
          </div>
        </Card>
      )}

      {(activeTab === 'muestra' || activeTab === 'reposicion') && (
        <Card className="p-16 text-center bg-white">
          <h2 className="text-2xl font-bold text-navy-900 mb-4">
            Disponibilidad para {activeTab === 'muestra' ? 'Clase Muestra' : 'Reposición'}
          </h2>
          <p className="text-secundario mb-8 max-w-md mx-auto">
            Calendario de cupos liberados por ausencias o grupos no llenos. Simulación de módulo.
          </p>
          <div className="h-64 bg-ice-50 rounded flex items-center justify-center border border-ice-100 text-secundario">
            [Grilla de Calendario de Disponibilidad]
          </div>
        </Card>
      )}
    </div>
  );
}
