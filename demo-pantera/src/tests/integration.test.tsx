import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '@/app/store';
import App from '@/App'; 

describe('Global Integration (Prompt 29)', () => { 
  beforeEach(() => { 
    // Reset state before each test 
    useAppStore.getState().resetDemo(); 
  }); 
  
  it('Searches and opens a student profile', async () => { 
    render(<App />); 
    // Login first 
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i })); 
    // Find global search 
    const searchInput = await screen.findByPlaceholderText(/Buscar módulos/i); 
    expect(searchInput).toBeInTheDocument(); 
    // Type something 
    fireEvent.change(searchInput, { target: { value: 'Mateo' } }); 
    // Results should appear (mocking the fact that Mateo is in the deterministic dataset) 
    const result = await screen.findByText(/Mateo/i); 
    expect(result).toBeInTheDocument(); 
    // Click result 
    fireEvent.click(result); 
    // App should navigate to M2.1 Profile 
    const profile = await screen.findByText(/Perfil Integral del Alumno/i); 
    expect(profile).toBeInTheDocument(); 
  }); 
  
  it('Dismisses an alert and reflects it', async () => { 
    // Testing the store logic directly for transversal features as UI needs login + layout 
    const store = useAppStore.getState(); 
    expect(store.dismissedAlerts.length).toBe(0); 
    store.dismissAlert('a1'); 
    expect(useAppStore.getState().dismissedAlerts.length).toBe(1); 
    expect(useAppStore.getState().dismissedAlerts[0]).toBe('a1'); 
    expect(useAppStore.getState().sessionChanges).toBe(1); 
  }); 
  
  it('Accepts a recommendation and creates a task', async () => { 
    // Navigate to recommendations programmatically or via store 
    const store = useAppStore.getState(); 
    expect(store.planActions.length).toBe(0); 
    store.addPlanAction({ 
      id: 'task_1', 
      task: 'Test Task', 
      source: 'M11.1', 
      owner: 'Admin', 
      deadline: '2026-10-10', 
      metric: 'Ingresos', 
      status: 'todo', 
      impact: { estimate: 5000, unit: 'MXN', metric: 'Ingresos' } 
    }); 
    expect(useAppStore.getState().planActions.length).toBe(1); 
    expect(useAppStore.getState().sessionChanges).toBe(1); 
    // Check reset 
    store.resetDemo(); 
    expect(useAppStore.getState().planActions.length).toBe(0); 
    expect(useAppStore.getState().sessionChanges).toBe(0); 
  });
});
