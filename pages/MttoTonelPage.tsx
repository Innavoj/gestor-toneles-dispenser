import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MttoTonel, MttoTonelFormData, Tonel } from '../types';
import { mttoTonelService } from '../services/mttoTonelService';
import { tonelService } from '../services/tonelService'; 
import MttoTonelList from '../components/mantenimiento/MttoTonelList';
import MttoTonelForm from '../components/mantenimiento/MttoTonelForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { PlusIcon } from '../components/ui/Icon';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const MttoTonelPage: React.FC = () => {
  const [tasks, setTasks] = useState<MttoTonel[]>([]);
  const [toneles, setToneles] = useState<Tonel[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<MttoTonel | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tasksData, tonelesData] = await Promise.all([
        mttoTonelService.getAllMttoToneles(),
        tonelService.getAllToneles() 
      ]);
      setTasks(tasksData.sort((a,b) => new Date(b.fechaini).getTime() - new Date(a.fechaini).getTime()));
      setToneles(tonelesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar tareas de mantenimiento o toneles.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('action') === 'add') {
      handleOpenFormModal();
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);

  const handleOpenFormModal = (task: MttoTonel | null = null) => {
    setEditingTask(task);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setEditingTask(null);
    setIsFormModalOpen(false);
  };

  const handleSubmitTask = async (data: MttoTonelFormData) => {
    try {
      setIsLoading(true); // Or use modal-specific loading
      if (editingTask) {
        await mttoTonelService.updateMttoTonel(editingTask.idmtto, data);
      } else {
        await mttoTonelService.addMttoTonel(data);
      }
      await fetchData(); 
      handleCloseFormModal();
    } catch (err) {
      setError(err instanceof Error ? (editingTask ? 'Error al actualizar tarea.' : 'Error al registrar tarea.') : 'Ocurrió un error inesperado.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (idmtto: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta tarea de mantenimiento?')) {
      try {
        setIsLoading(true);
        await mttoTonelService.deleteMttoTonel(idmtto);
        await fetchData();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar la tarea.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl py-6 font-bold text-brew-brown-700">Mantenimiento de Toneles</h2>
        <Button variant="primary" onClick={() => handleOpenFormModal()} leftIcon={<PlusIcon />}>
          Programar Nueva Tarea
        </Button>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

      {isLoading && !isFormModalOpen ? (
        <LoadingSpinner message="Cargando tareas de mantenimiento..." />
      ) : (
        <MttoTonelList 
            tasks={tasks} 
            toneles={toneles}
            onEditTask={handleOpenFormModal} 
            onDeleteTask={handleDeleteTask} 
        />
      )}

      {isFormModalOpen && ( 
          <Modal 
            isOpen={isFormModalOpen} 
            onClose={handleCloseFormModal} 
            title={editingTask ? 'Editar Tarea de Mantenimiento' : 'Programar Nueva Tarea de Mantenimiento'}
            size="lg"
          >
            {toneles.length > 0 ? (
                <MttoTonelForm 
                    onSubmit={handleSubmitTask} 
                    onCancel={handleCloseFormModal} 
                    toneles={toneles}
                    initialData={editingTask}
                    isEditMode={!!editingTask}
                />
            ) : (
                 <div className="p-4 text-center">
                    <p className="text-brew-brown-600 mb-4">No hay toneles registrados para programar mantenimiento. Por favor, registre un tonel primero.</p>
                    <Button onClick={handleCloseFormModal} variant="primary">Entendido</Button>
                </div>
            )}
          </Modal>
      )}
    </div>
  );
};

export default MttoTonelPage;
