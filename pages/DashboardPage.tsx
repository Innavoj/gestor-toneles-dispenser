import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Tonel, TonelStatus, LoteProduccion, MttoTonel, MttoTaskStatus, LoteProduccionStatus, Dispensador, MttoDispensador, DispensadorStatus } from '../types';
import { tonelService } from '../services/tonelService';
import { loteService } from '../services/loteService';
import { mttoTonelService } from '../services/mttoTonelService';
// import { eventoService } from '../services/eventoService'; // No longer needed for mock init
import { dispensadorService } from '../services/dispensadorService';
import { mttoDispensadorService } from '../services/mttoDispensadorService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PlusIcon, CubeIcon, DocumentTextIcon, WrenchScrewdriverIcon, BriefcaseIcon as DispenserIcon } from '../components/ui/Icon';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// initializeMockServiceData and its direct dependencies in services (initMockData) are removed
// as services now directly call APIs.

interface IconPropsSVG extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement<IconPropsSVG>;
  colorClass: string;
  linkTo?: string;
  linkText?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, linkTo, linkText }) => (
  <Card className={`border-l-4 ${colorClass}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-brew-brown-500 uppercase">{title}</p>
        <p className="text-3xl font-semibold text-brew-brown-800">{value}</p>
      </div>
      <div className={`p-3 rounded-full bg-opacity-20 ${colorClass.replace('border-', 'bg-')}`}>
         {React.cloneElement(icon, { className: `h-7 w-7 ${colorClass.replace('border-', 'text-').replace('bg-','text-')}` })}
      </div>
    </div>
    {linkTo && linkText && (
      <div className="mt-4">
        <Link to={linkTo}>
          <Button variant="outline" size="sm">{linkText}</Button>
        </Link>
      </div>
    )}
  </Card>
);


const DashboardPage: React.FC = () => {
  const [toneles, setToneles] = useState<Tonel[]>([]);
  const [lotes, setLotes] = useState<LoteProduccion[]>([]);
  const [mttoToneles, setMttoToneles] = useState<MttoTonel[]>([]);
  const [dispensadores, setDispensadores] = useState<Dispensador[]>([]);
  const [mttoDispensadores, setMttoDispensadores] = useState<MttoDispensador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // No longer initializing mock data here
        const [
          tonelesData, 
          lotesData, 
          mttoTonelesData,
          dispensadoresData,
          mttoDispensadoresData
        ] = await Promise.all([
          tonelService.getAllToneles(),
          loteService.getAllLotes(),
          mttoTonelService.getAllMttoToneles(),
          dispensadorService.getAllDispensadores(),
          mttoDispensadorService.getAllMttoDispensadores()
        ]);
        setToneles(tonelesData);
        setLotes(lotesData);
        setMttoToneles(mttoTonelesData);
        setDispensadores(dispensadoresData);
        setMttoDispensadores(mttoDispensadoresData);
      } catch (err) {
        console.error("Error al cargar datos del panel:", err);
        setError(err instanceof Error ? err.message : 'Error al cargar datos del panel.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const totalToneles = toneles.length;
    const tonelesDisponibles = toneles.filter(t => 
        t.status === TonelStatus.VACIO || 
        t.status === TonelStatus.LLENO // Assuming 'lleno' is also available for assignment
    ).length;
    const tonelesEnUso = toneles.filter(t => t.status === TonelStatus.ASIGNADO_A_DISPENSER).length;
    
    const lotesActivos = lotes.filter(l => l.status !== LoteProduccionStatus.COMPLETADO).length;
    
    const mttoTonelesPendientes = mttoToneles.filter(m => m.status === MttoTaskStatus.PROGRAMADO || m.status === MttoTaskStatus.EN_PROCESO).length;
    
    const totalDispensadores = dispensadores.length;
    const mttoDispensadoresPendientes = mttoDispensadores.filter(m => m.status === MttoTaskStatus.PROGRAMADO || m.status === MttoTaskStatus.EN_PROCESO).length;


    return { totalToneles, tonelesDisponibles, tonelesEnUso, lotesActivos, mttoTonelesPendientes, totalDispensadores, mttoDispensadoresPendientes };
  }, [toneles, lotes, mttoToneles, dispensadores, mttoDispensadores]);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><LoadingSpinner message="Cargando panel principal..." /></div>;
  }
  if (error) {
    return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl py-6 font-bold text-brew-brown-700">Panel Principal</h2>
        {/* Quick add buttons can be added here or in Quick Actions card */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard title="Total Toneles" value={stats.totalToneles} icon={<CubeIcon />} colorClass="border-brew-brown-500" linkTo="/toneles" linkText="Gestionar Toneles"/>
        <StatCard title="Toneles Disponibles" value={stats.tonelesDisponibles} icon={<CubeIcon />} colorClass="border-green-500" />
        <StatCard title="Toneles en Uso" value={stats.tonelesEnUso} icon={<CubeIcon />} colorClass="border-teal-500" />
        <StatCard title="Lotes Activos" value={stats.lotesActivos} icon={<DocumentTextIcon />} colorClass="border-blue-500" linkTo="/lotes" linkText="Gestionar Lotes" />
        <StatCard title="Mtto. Toneles Pendiente" value={stats.mttoTonelesPendientes} icon={<WrenchScrewdriverIcon />} colorClass="border-yellow-500" linkTo="/mantenimiento-toneles" linkText="Ver Mtto. Toneles" />
        <StatCard title="Total Dispensadores" value={stats.totalDispensadores} icon={<DispenserIcon size={20}/>} colorClass="border-purple-500" linkTo="/dispensadores" linkText="Gestionar Dispensadores"/>
        <StatCard title="Mtto. Dispensadores Pendiente" value={stats.mttoDispensadoresPendientes} icon={<WrenchScrewdriverIcon />} colorClass="border-orange-500" linkTo="/mantenimiento-dispensadores" linkText="Ver Mtto. Dispensadores" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Acciones Rápidas">
          <div className="space-y-3">
            <Link to="/toneles?action=add" className="block">
                <Button variant="primary" leftIcon={<PlusIcon />} className="w-full justify-start">Registrar Nuevo Tonel</Button>
            </Link>
            <Link to="/lotes?action=add" className="block">
                <Button variant="secondary" leftIcon={<PlusIcon />} className="w-full justify-start">Iniciar Nuevo Lote de Producción</Button>
            </Link>
             <Link to="/dispensadores?action=add" className="block">
                <Button variant="primary" leftIcon={<PlusIcon />} className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white">Registrar Nuevo Dispensador</Button>
            </Link>
            <Link to="/mantenimiento-toneles?action=add" className="block">
                <Button variant="outline" className="w-full justify-start">Programar Mtto. de Tonel</Button>
            </Link>
             <Link to="/mantenimiento-dispensadores?action=add" className="block">
                <Button variant="outline" className="w-full justify-start">Programar Mtto. de Dispensador</Button>
            </Link>
          </div>
        </Card>
        
        <Card title="Resumen Estado de Toneles">
            {Object.values(TonelStatus).map(status => {
                const count = toneles.filter(t => t.status === status).length;
                if (count === 0 && toneles.length > 0) return null;
                return (
                    <div key={status} className="flex justify-between items-center py-1.5 border-b border-brew-brown-100 last:border-b-0">
                        <span className="text-sm text-brew-brown-600">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                        <span className="font-semibold text-brew-brown-700">{count}</span>
                    </div>
                );
            })}
             {toneles.length === 0 && <p className="text-sm text-brew-brown-500">No hay datos de toneles disponibles.</p>}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;