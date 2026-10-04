import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useAppStore } from '@/app/store';
import { X, CheckSquare, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from './components/utils';

export function ActionPlanDrawer() {
  const { actionPlanOpen, toggleActionPlan, planActions } = useAppStore();
  const navigate = useNavigate();

  return (
    <>
      {actionPlanOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 z-50 transition-opacity" 
          onClick={toggleActionPlan}
        />
      )}
      
      <div className={cn(
        "fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
        actionPlanOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-sky-500" /> 
            Plan de Acción
          </h2>
          <button onClick={toggleActionPlan} className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
          {planActions.length === 0 ? (
            <div className="text-center text-slate-500 text-sm mt-10">
              No hay tareas en el plan de acción.
            </div>
          ) : (
            <div className="space-y-3">
              {planActions.map((task, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{task.title}</h4>
                  </div>
                  <div className="text-xs text-slate-500 mb-3">{task.desc}</div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1 text-slate-400"><Calendar className="w-3 h-3" /> Hoy</span>
                    <button className="text-sky-600 hover:underline">Completar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <button 
            onClick={() => { toggleActionPlan(); navigate('/c11/m11-3'); }}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors"
          >
            Abrir tablero completo <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
