import React from 'react';

import { Card } from '@/ui/components/Cards';

export interface LabLayoutProps {
  title: string;
  businessQuestion: string;
  description: string;
  findings: React.ReactNode;
  action: React.ReactNode;
  formulas?: React.ReactNode;
  assumptions?: React.ReactNode;
}

export function LabLayout({
  title,
  businessQuestion,
  description,
  findings,
  action,
  formulas,
  assumptions,
}: LabLayoutProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-32">
      <div className="space-y-6 flex flex-col h-full overflow-auto pr-2 pb-6">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">{title}</h1>
          <p className="text-lg text-secundario mt-1">{businessQuestion}</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 flex flex-col gap-6">
            <Card className="p-4 bg-white border border-ice-100 shadow-sm border-t-4 border-t-blue-500">
              <h3 className="font-bold text-navy-900 mb-2">¿Qué encontramos en tu escuela?</h3>
              {findings}
            </Card>

            {(formulas || assumptions) && (
              <div className="grid grid-cols-2 gap-6">
                {formulas && (
                  <Card className="p-4 bg-ice-50 border border-ice-200 shadow-sm">
                    <h4 className="text-xs font-bold text-secundario mb-2">FÓRMULAS USADAS</h4>
                    <div className="text-sm font-mono text-navy-900 overflow-x-auto whitespace-pre">
                      {formulas}
                    </div>
                  </Card>
                )}
                {assumptions && (
                  <Card className="p-4 bg-ice-50 border border-ice-200 shadow-sm">
                    <h4 className="text-xs font-bold text-secundario mb-2">SUPUESTOS</h4>
                    <div className="text-sm text-secundario">{assumptions}</div>
                  </Card>
                )}
              </div>
            )}
          </div>

          <div className="col-span-4 flex flex-col gap-6">
            <Card className="p-4 bg-white border border-ice-100 shadow-sm">
              <h3 className="font-bold text-navy-900 mb-2">¿Qué es esto?</h3>
              <p className="text-sm text-secundario">{description}</p>
            </Card>

            <Card className="p-4 bg-white border border-ice-100 shadow-sm border-t-4 border-t-amber-400 flex-1">
              <h3 className="font-bold text-navy-900 mb-2">¿Qué hacer con esto?</h3>
              {action}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
