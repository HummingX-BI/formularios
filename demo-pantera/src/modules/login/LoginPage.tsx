import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/components';

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ice-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-soft-blue p-8 border border-ice-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-display font-bold text-2xl">CA</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Club Azulejo - Escuela de Natación</h1>
          <p className="text-text-secondary mt-2">Panel de administración</p>
        </div>

        <div className="space-y-4">
          <div className="bg-sky-50 border border-sky-200 text-blue-800 text-sm rounded-lg p-3 text-center mb-6">
            Acceso de demostración
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Usuario</label>
            <input type="text" disabled value="demo@clubazulejo.com" className="w-full px-3 py-2 border rounded-md bg-ice-50 text-text-tenue" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Contraseña</label>
            <input type="password" disabled value="********" className="w-full px-3 py-2 border rounded-md bg-ice-50 text-text-tenue" />
          </div>

          <Button variant="primary" className="w-full mt-4" onClick={() => navigate('/c01/m1-1')}>
            Entrar
          </Button>
        </div>
      </div>
    </div>
  );
}
