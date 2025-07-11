import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Location, LocationFormData } from '../../types';
import { locationService } from '../../services/locationService';
import Modal from '../../components/ui/Modal';
import LocationForm from '@/components/location/LocationForm';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { HomeIcon, PlusIcon } from '../../components/ui/Icon';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import LocationList from '@/components/location/LocationList';

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


const AdminDashboardPage: React.FC = () => {
  const [location, setLocation] = useState<Location[]>([]);
  //const [lotes, setLotes] = useState<LoteProduccion[]>([]);
 // const [mttoToneles, setMttoToneles] = useState<MttoTonel[]>([]);
 // const [dispensadores, setDispensadores] = useState<Dispensador[]>([]);
 // const [mttoDispensadores, setMttoDispensadores] = useState<MttoDispensador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


const fetchLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await locationService.getAllLocation();
      setLocation(data.sort((a,b) => a.location.localeCompare(b.location)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar locales.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // No longer initializing mock data here
        const [
          locationData, 

        ] = await Promise.all([
          locationService.getAllLocation(),

        ]);
        setLocation(locationData);
      //  console.log(locationData);
      } catch (err) {
        console.error("Error al cargar datos del panel:", err);
        setError(err instanceof Error ? err.message : 'Error al cargar datos del panel.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const handleAddLocation = async (data: LocationFormData) => {
    try {
      setIsLoading(true);
      await locationService.addLocation(data);
      await fetchLocation(); 
      setIsAddLocationModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el locales.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLocation = async (idlocation: string) => {
      if (window.confirm('¿Está seguro de que desea eliminar este local? Esta acción no se puede deshacer.')) {
        try {
          setIsLoading(true);
          await locationService.deleteLocation(idlocation);
          await fetchLocation(); 
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error al eliminar el local.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    };


  const stats = useMemo(() => {
    const totalLocation = location.length;
  //  console.log(location);
    return { totalLocation };
    
  }, [location]);

  if (loading) { 
    return <div className="flex justify-center items-center h-full"><LoadingSpinner message="Cargando panel admin..." /></div>;
  }
  if (error) {
    return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl py-6 font-bold text-brew-brown-700">Panel Admin</h2>
        <Button onClick={() => setIsAddLocationModalOpen(true)} variant="primary"  leftIcon={<PlusIcon />}>
          Registrar Nuevo Local
        </Button>
        {/* Quick add buttons can be added here or in Quick Actions card */}
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard title="Total Locales" value={stats.totalLocation} icon={<HomeIcon />} colorClass="border-brew-brown-500" />
      </div>
      
      <div className="space-y-6">
      {/* Check if the initial toneles array is empty */}
      {location.length === 0 && !isLoading && !error ? (
        <div className="text-center py-10">
          <h2 className="text-2xl md:text-3xl font-bold text-brew-brown-700 mb-4">No hay locales registrados</h2>
          <p className="text-gray-600 mb-6">Parece que no hay locales en el sistema. Puedes registrar uno nuevo haciendo clic en el botón de arriba.</p>
            {/* <Button onClick={() => setIsAddLocationModalOpen(true)} variant="primary" leftIcon={<PlusIcon />}>
            Registrar Nuevo Tonel
          </Button>   */}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl md:text-3xl py-6 font-bold text-brew-brown-700">Gestión de Locales</h2>
          </div>

          {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

          {isLoading && !isAddLocationModalOpen ? (
            <LoadingSpinner message="Cargando locales..." />
          ) : (
            <LocationList 
                location={location} 
                onDeleteLocation={handleDeleteLocation} 
            //    onUpdateTonelStatus={openUpdateStatusModal}
             //   onScheduleMaintenance={openScheduleMaintenanceModal}
            />
          )}
        </>
      )}

      <Modal isOpen={isAddLocationModalOpen} onClose={() => setIsAddLocationModalOpen(false)} title="Registrar Nuevo Local" size="md">
        <LocationForm onSubmit={handleAddLocation} onCancel={() => setIsAddLocationModalOpen(false)} />
      </Modal> 

      {/* {tonelToUpdateStatus && (
        <UpdateTonelStatusModal
          isOpen={isUpdateStatusModalOpen}
          onClose={() => setIsUpdateStatusModalOpen(false)}
          tonel={tonelToUpdateStatus}
          onUpdate={handleUpdateTonelStatus}
        />
      )} */}
      
      {/* {tonelForMaintenance && (
        <Modal 
            isOpen={isScheduleMaintenanceModalOpen} 
            onClose={() => {setIsScheduleMaintenanceModalOpen(false); setTonelForMaintenance(null);}} 
            title={`Programar Mantenimiento para Tonel: ${tonelForMaintenance.nserial}`}
            size="lg"
        >
            <MttoTonelForm 
                onSubmit={handleScheduleMaintenance} 
                onCancel={() => {setIsScheduleMaintenanceModalOpen(false); setTonelForMaintenance(null);}}
                toneles={toneles} // Pass all toneles for selection if form allows changing, or just the one.
                                // Current MttoTonelForm takes list but disables selection if defaultTonelId.
                defaultTonelId={tonelForMaintenance.idtonel}
            />
        </Modal>
      )} */}
    </div>
    </div>
  );
};

export default AdminDashboardPage;