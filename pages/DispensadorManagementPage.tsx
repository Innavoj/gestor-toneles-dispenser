
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dispensador, DispensadorFormData, MttoDispensadorFormData } from '../types';
import { dispensadorService } from '../services/dispensadorService';
import { mttoDispensadorService } from '../services/mttoDispensadorService';
import DispensadorList from '../components/dispensadores/DispensadorList';
import DispensadorForm from '../components/dispensadores/DispensadorForm';
import MttoDispensadorForm from '../components/mantenimiento/MttoDispensadorForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { PlusIcon } from '../components/ui/Icon';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const DispensadorManagementPage: React.FC = () => {
  const [dispensadores, setDispensadores] = useState<Dispensador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDispensador, setEditingDispensador] = useState<Dispensador | null>(null);
  
  const [isScheduleMaintenanceModalOpen, setIsScheduleMaintenanceModalOpen] = useState(false);
  const [dispensadorForMaintenance, setDispensadorForMaintenance] = useState<Dispensador | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchDispensadores = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dispensadorService.getAllDispensadores();
      setDispensadores(data.sort((a,b) => a.nserial.localeCompare(b.nserial)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar dispensadores.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDispensadores();
  }, [fetchDispensadores]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('action') === 'add') {
      handleOpenFormModal(null); // Open for adding
      navigate(location.pathname, { replace: true }); 
    }
  }, [location.search, location.pathname, navigate]);

  const handleOpenFormModal = (dispensador: Dispensador | null) => {
    setEditingDispensador(dispensador);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setEditingDispensador(null);
    setIsFormModalOpen(false);
  };

  const handleSubmitDispensador = async (data: DispensadorFormData) => {
    try {
      setIsLoading(true);
      if (editingDispensador) {
        await dispensadorService.updateDispensador(editingDispensador.iddispensador, data);
      } else {
        await dispensadorService.addDispensador(data);
      }
      await fetchDispensadores(); 
      handleCloseFormModal();
    } catch (err) {
      setError(err instanceof Error ? (editingDispensador ? 'Error al actualizar.' : 'Error al registrar.') : 'Ocurrió un error.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDispensador = async (iddispensador: string) => {
    if (window.confirm('¿Está seguro de eliminar este dispensador?')) {
      try {
        setIsLoading(true);
        await dispensadorService.deleteDispensador(iddispensador);
        await fetchDispensadores(); 
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar dispensador.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const openScheduleMaintenanceModal = (dispensador: Dispensador) => {
    setDispensadorForMaintenance(dispensador);
    setIsScheduleMaintenanceModalOpen(true);
  };

  const handleScheduleMaintenance = async (maintenanceData: MttoDispensadorFormData) => {
    try {
      setIsLoading(true);
      await mttoDispensadorService.addMttoDispensador(maintenanceData);
      // No need to refetch dispensadores unless maintenance affects its status directly shown in list
      setIsScheduleMaintenanceModalOpen(false);
      setDispensadorForMaintenance(null);
       // Could add a success message here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al programar mantenimiento.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-brew-brown-700">Gestión de Dispensadores</h2>
        <Button variant="primary" onClick={() => handleOpenFormModal(null)} leftIcon={<PlusIcon />}>
          Registrar Dispensador
        </Button>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

      {isLoading && !isFormModalOpen && !isScheduleMaintenanceModalOpen ? (
        <LoadingSpinner message="Cargando dispensadores..." />
      ) : (
        <DispensadorList 
            dispensadores={dispensadores} 
            onEditDispensador={handleOpenFormModal}
            onDeleteDispensador={handleDeleteDispensador} 
            onScheduleMaintenance={openScheduleMaintenanceModal}
        />
      )}

      <Modal 
        isOpen={isFormModalOpen} 
        onClose={handleCloseFormModal} 
        title={editingDispensador ? 'Editar Dispensador' : 'Registrar Nuevo Dispensador'} 
        size="lg"
      >
        <DispensadorForm 
            onSubmit={handleSubmitDispensador} 
            onCancel={handleCloseFormModal} 
            initialData={editingDispensador} 
            isEditMode={!!editingDispensador} 
        />
      </Modal>
      
      {dispensadorForMaintenance && (
        <Modal 
            isOpen={isScheduleMaintenanceModalOpen} 
            onClose={() => {setIsScheduleMaintenanceModalOpen(false); setDispensadorForMaintenance(null);}} 
            title={`Programar Mtto. para Dispensador: ${dispensadorForMaintenance.nserial}`}
            size="lg"
        >
            <MttoDispensadorForm 
                onSubmit={handleScheduleMaintenance} 
                onCancel={() => {setIsScheduleMaintenanceModalOpen(false); setDispensadorForMaintenance(null);}}
                dispensadores={[dispensadorForMaintenance]} // Pass only current for selection, or all if form needs
                defaultDispensadorId={dispensadorForMaintenance.iddispensador}
            />
        </Modal>
      )}
    </div>
  );
};

export default DispensadorManagementPage;
