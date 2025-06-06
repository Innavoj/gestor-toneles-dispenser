
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MttoDispensador, MttoDispensadorFormData, Dispensador } from '../types';
import { mttoDispensadorService } from '../services/mttoDispensadorService';
import { dispensadorService } from '../services/dispensadorService'; 
import MttoDispensadorList from '../components/mantenimiento/MttoDispensadorList';
import MttoDispensadorForm from '../components/mantenimiento/MttoDispensadorForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { PlusIcon } from '../components/ui/Icon';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const MttoDispensadorPage: React.FC = () => {
  const [tasks, setTasks] = useState<MttoDispensador[]>([]);
  const [dispensadores, setDispensadores] = useState<Dispensador[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<MttoDispensador | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tasksData, dispensadoresData] = await Promise.all([
        mttoDispensadorService.getAllMttoDispensadores(),
        dispensadorService.getAllDispensadores() 
      ]);
      setTasks(tasksData.sort((a,b) => new Date(b.fechaini).getTime() - new Date(a.fechaini).getTime()));
      setDispensadores(dispensadoresData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos de mantenimiento o dispensadores.');
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

  const handleOpenFormModal = (task: MttoDispensador | null = null) => {
    setEditingTask(task);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setEditingTask(null);
    setIsFormModalOpen(false);
  };

  const handleSubmitTask = async (data: MttoDispensadorFormData) => {
    try {
      setIsLoading(true);
      if (editingTask) {
        await mttoDispensadorService.updateMttoDispensador(editingTask.idmtto, data);
      } else {
        await mttoDispensadorService.addMttoDispensador(data);
      }
      await fetchData(); 
      handleCloseFormModal();
    } catch (err) {
      setError(err instanceof Error ? (editingTask ? 'Error al actualizar.' : 'Error al registrar.') : 'Ocurrió un error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (idmtto: string) => {
    if (window.confirm('¿Eliminar esta tarea de mantenimiento?')) {
      try {
        setIsLoading(true);
        await mttoDispensadorService.deleteMttoDispensador(idmtto);
        await fetchData();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar tarea.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-brew-brown-700">Mantenimiento de Dispensadores</h2>
        <Button variant="primary" onClick={() => handleOpenFormModal()} leftIcon={<PlusIcon />}>
          Programar Nueva Tarea
        </Button>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

      {isLoading && !isFormModalOpen ? (
        <LoadingSpinner message="Cargando tareas..." />
      ) : (
        <MttoDispensadorList 
            tasks={tasks} 
            dispensadores={dispensadores}
            onEditTask={handleOpenFormModal} 
            onDeleteTask={handleDeleteTask} 
        />
      )}

      {isFormModalOpen && ( 
          <Modal 
            isOpen={isFormModalOpen} 
            onClose={handleCloseFormModal} 
            title={editingTask ? 'Editar Tarea de Mtto.' : 'Programar Nueva Tarea de Mtto.'}
            size="lg"
          >
            {dispensadores.length > 0 ? (
                <MttoDispensadorForm 
                    onSubmit={handleSubmitTask} 
                    onCancel={handleCloseFormModal} 
                    dispensadores={dispensadores}
                    initialData={editingTask}
                    isEditMode={!!editingTask}
                />
            ) : (
                 <div className="p-4 text-center">
                    <p className="text-brew-brown-600 mb-4">No hay dispensadores registrados para programar mantenimiento.</p>
                    <Button onClick={handleCloseFormModal} variant="primary">Entendido</Button>
                </div>
            )}
          </Modal>
      )}
    </div>
  );
};

export default MttoDispensadorPage;

