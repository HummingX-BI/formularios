import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/components';
import { SearchX } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
      <SearchX className="h-20 w-20 text-text-tenue mb-4" />
      <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
        Página no encontrada
      </h1>
      <p className="text-text-secondary mb-6">
        El módulo o ruta que buscas no existe en esta demostración.
      </p>
      <Button variant="primary" onClick={() => navigate('/c01/m1-1')}>
        Ir al inicio (M1.1)
      </Button>
    </div>
  );
}
