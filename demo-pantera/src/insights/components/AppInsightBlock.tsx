import React from 'react';
import { InsightBlock } from '../../ui/components/Cards';
import type { Insight } from '../types';
import { useAppStore } from '../../app/store';

export const AppInsightBlock: React.FC<{ insight: Insight }> = ({ insight }) => {
  const addPlanAction = useAppStore(state => state.addPlanAction);
  const planActions = useAppStore(state => state.planActions);

  // Check if this insight is already in the plan actions
  const isAdded = planActions.some(a => a.insightId === insight.id);

  const severityMap = {
    info: 'low',
    positivo: 'low',
    atencion: 'medium',
    alerta: 'high',
    critico: 'critical' // Fallback
  } as const;

  const handleAction = () => {
    addPlanAction({
      id: `action-${Date.now()}`,
      insightId: insight.id,
      title: insight.headline,
      description: insight.summary,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <InsightBlock
      title={insight.headline}
      conclusion={insight.summary}
      {...(insight.bullets && insight.bullets.length > 0 ? { whatToDo: insight.bullets.join(' ') } : {})}
      severity={severityMap[insight.severity] || 'low'}
      {...(!isAdded ? { onAction: handleAction } : {})}
      actionLabel={isAdded ? "En el plan de acción" : "Enviar al plan de acción"}
    />
  );
};
