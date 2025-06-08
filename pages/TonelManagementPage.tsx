
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } // Added useNavigate
    from 'react-router-dom';
import { Tonel, TonelFormData, TonelStatus, MttoTonelFormData, TonelLocation } from '../types'; // Added TonelLocation
import { tonelService } from '../services/tonelService';
import { mttoTonelService } from '../services/mttoTonelService';
import TonelList from '../components/toneles/TonelList';
import TonelForm from '../components/toneles/TonelForm';
import UpdateTonelStatusModal from '../components/toneles/UpdateTonelStatusModal';
import MttoTonelForm from '../components/mantenimiento/MttoTonelForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { PlusIcon } from '../components/ui/Icon';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const TonelManagementPage: React.FC = () => {
  const [toneles, setToneles] = useState<Tonel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddTonelModalOpen, setIsAddTonelModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [tonelToUpdateStatus, setTonelToUpdateStatus] = useState<Tonel | null>(null);
  
  const [isScheduleMaintenanceModalOpen, setIsScheduleMaintenanceModalOpen] = useState(false);
  const [tonelForMaintenance, setTonelForMaintenance] = useState<Tonel | null>(null);

  const location = useLocation();
  const navigate = useNavigate(); // For clearing query params

  const fetchToneles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tonelService.getAllToneles();
      setToneles(data.sort((a,b) => a.nserial.localeCompare(b.nserial)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar toneles.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToneles();
  }, [fetchToneles]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('action') === 'add') {
      setIsAddTonelModalOpen(true);
      // Optional: remove query param after opening modal to prevent re-triggering on refresh
      navigate(location.pathname, { replace: true }); 
    }
  }, [location.search, location.pathname, navigate]);


  const handleAddTonel = async (data: TonelFormData) => {
    try {
      setIsLoading(true);
      await tonelService.addTonel(data);
      await fetchToneles(); 
      setIsAddTonelModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el tonel.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTonel = async (idtonel: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este tonel? Esta acción no se puede deshacer.')) {
      try {
        setIsLoading(true);
        await tonelService.deleteTonel(idtonel);
        await fetchToneles(); 
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar el tonel.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const openUpdateStatusModal = (tonel: Tonel) => {
    setTonelToUpdateStatus(tonel);
    setIsUpdateStatusModalOpen(true);
  };

  const handleUpdateTonelStatus = async (idtonel: string, status: TonelStatus, newLocation: TonelLocation, notas?: string) => {
    try {
      setIsLoading(true);
      await tonelService.updateTonelStatusLocation(idtonel, { status, location: newLocation, notas });
      await fetchToneles(); 
      setIsUpdateStatusModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar estado/ubicación del tonel.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const openScheduleMaintenanceModal = (tonel: Tonel) => {
    setTonelForMaintenance(tonel);
    setIsScheduleMaintenanceModalOpen(true);
  };

  const handleScheduleMaintenance = async (maintenanceData: MttoTonelFormData) => {
    try {
      setIsLoading(true);
      await mttoTonelService.addMttoTonel(maintenanceData);
      await fetchToneles(); // Potentially refetch toneles if maintenance affects their status/dates
      setIsScheduleMaintenanceModalOpen(false);
      setTonelForMaintenance(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al programar mantenimiento.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-brew-brown-700">Gestión de Toneles</h2>
        <Button variant="primary" onClick={() => setIsAddTonelModalOpen(true)} leftIcon={<PlusIcon />}>
          Registrar Nuevo Tonel
        </Button>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

      {isLoading && !isAddTonelModalOpen && !isUpdateStatusModalOpen && !isScheduleMaintenanceModalOpen ? (
        <LoadingSpinner message="Cargando toneles..." />
      ) : (
        <TonelList 
            toneles={toneles} 
            onDeleteTonel={handleDeleteTonel} 
            onUpdateTonelStatus={openUpdateStatusModal}
            onScheduleMaintenance={openScheduleMaintenanceModal}
        />
      )}

      <Modal isOpen={isAddTonelModalOpen} onClose={() => setIsAddTonelModalOpen(false)} title="Registrar Nuevo Tonel" size="lg">
        <TonelForm onSubmit={handleAddTonel} onCancel={() => setIsAddTonelModalOpen(false)} />
      </Modal>

      {tonelToUpdateStatus && (
        <UpdateTonelStatusModal
          isOpen={isUpdateStatusModalOpen}
          onClose={() => setIsUpdateStatusModalOpen(false)}
          tonel={tonelToUpdateStatus}
          onUpdate={handleUpdateTonelStatus}
        />
      )}
      
      {tonelForMaintenance && (
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
      )}
    </div>
  );
};

export default TonelManagementPage;
