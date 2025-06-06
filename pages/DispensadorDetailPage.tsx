
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Dispensador, MttoDispensador, DispensadorFormData, MttoDispensadorFormData } from '../types';
import { dispensadorService } from '../services/dispensadorService';
import { mttoDispensadorService } from '../services/mttoDispensadorService';
//import { formatDate } from '@utils';
import { formatDate } from '@/utils';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { EditIcon, PlusIcon } from '../components/ui/Icon';
import MttoDispensadorList from '../components/mantenimiento/MttoDispensadorList';
import Modal from '../components/ui/Modal';
import DispensadorForm from '../components/dispensadores/DispensadorForm';
import MttoDispensadorForm from '../components/mantenimiento/MttoDispensadorForm';

const DispensadorDetailPage: React.FC = () => {
  const { iddispensador } = useParams<{ iddispensador: string }>();
  const navigate = useNavigate();
  const [dispensador, setDispensador] = useState<Dispensador | null>(null);
  const [mttoTasks, setMttoTasks] = useState<MttoDispensador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isScheduleMaintenanceModalOpen, setIsScheduleMaintenanceModalOpen] = useState(false);
  const [editingMaintenanceTask, setEditingMaintenanceTask] = useState<MttoDispensador | null>(null);

  const fetchData = useCallback(async () => {
    if (!iddispensador) {
      setError("ID de Dispensador no encontrado.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const dispensadorData = await dispensadorService.getDispensadorById(iddispensador);
      if (!dispensadorData) {
        setError(`Dispensador con ID ${iddispensador} no encontrado.`);
        setDispensador(null);
      } else {
        setDispensador(dispensadorData);
        const maintenanceData = await mttoDispensadorService.getMttoDispensadoresByDispensadorId(iddispensador);
        setMttoTasks(maintenanceData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar detalles del dispensador.');
    } finally {
      setIsLoading(false);
    }
  }, [iddispensador]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateDispensador = async (data: DispensadorFormData) => {
    if (!dispensador) return;
    try {
      setIsLoading(true);
      await dispensadorService.updateDispensador(dispensador.iddispensador, data);
      await fetchData(); 
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar dispensador.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMaintenanceTask = async (data: MttoDispensadorFormData) => {
    if (!dispensador) return;
    try {
      setIsLoading(true);
      if (editingMaintenanceTask) {
        await mttoDispensadorService.updateMttoDispensador(editingMaintenanceTask.idmtto, data);
      } else {
        await mttoDispensadorService.addMttoDispensador({...data, iddispensador: dispensador.iddispensador});
      }
      await fetchData();
      setIsScheduleMaintenanceModalOpen(false);
      setEditingMaintenanceTask(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar tarea de mantenimiento.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMaintenanceTask = (task: MttoDispensador) => {
    setEditingMaintenanceTask(task);
    setIsScheduleMaintenanceModalOpen(true);
  };

  const handleDeleteMaintenanceTask = async (idmtto: string) => {
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

  if (isLoading && !dispensador) return <div className="flex justify-center items-center h-64"><LoadingSpinner message="Cargando detalles..." /></div>;
  if (error && !dispensador) return <p className="text-red-500 bg-red-100 p-4 rounded-md text-center">{error}</p>;
  if (!dispensador) return (
    <div className="text-center py-10">
        <p className="text-brew-brown-600 text-xl mb-4">Dispensador no encontrado.</p>
        <Link to="/dispensadores"><Button variant="primary">Volver a Lista</Button></Link>
    </div>
    );

  const detailItem = (label: string, value?: React.ReactNode) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 border-t border-brew-brown-100 first:border-t-0">
      <dt className="text-sm font-medium text-brew-brown-500">{label}</dt>
      <dd className="mt-1 text-sm text-brew-brown-900 sm:mt-0 sm:col-span-2">{value || <span className="text-gray-400">N/A</span>}</dd>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-brew-brown-700">Dispensador: {dispensador.nserial}</h2>
        <Button variant="outline" onClick={() => setIsEditModalOpen(true)} leftIcon={<EditIcon />}>
          Editar Dispensador
        </Button>
      </div>
      { isLoading && <LoadingSpinner message="Actualizando..." /> }
      { error && <p className="text-red-500 bg-red-100 p-3 rounded-md my-2">{error}</p> }

      <Card title="Información del Dispensador">
        <dl>
          {detailItem("ID Sistema", dispensador.iddispensador)}
          {detailItem("NSerie", dispensador.nserial)}
          {detailItem("Estado", dispensador.status)}
          {detailItem("Ubicación", dispensador.location)}
          {detailItem("Fecha Adquisición", formatDate(dispensador.acquired))}
          {detailItem("Notas", dispensador.notas ? <pre className="whitespace-pre-wrap font-sans text-sm">{dispensador.notas}</pre> : null)}
        </dl>
      </Card>
      
      <Card title="Mantenimiento Programado e Historial" actions={
          <Button variant="primary" size="sm" onClick={() => {setEditingMaintenanceTask(null); setIsScheduleMaintenanceModalOpen(true)}} leftIcon={<PlusIcon />}>
            Nueva Tarea Mtto.
          </Button>
      }>
        <MttoDispensadorList tasks={mttoTasks} dispensadores={[dispensador]} onEditTask={handleEditMaintenanceTask} onDeleteTask={handleDeleteMaintenanceTask} />
      </Card>
      
      <div className="mt-8">
        <Link to="/dispensadores"><Button variant="outline">Volver a Lista de Dispensadores</Button></Link>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Dispensador" size="lg">
        <DispensadorForm onSubmit={handleUpdateDispensador} onCancel={() => setIsEditModalOpen(false)} initialData={dispensador} isEditMode />
      </Modal>
      
      <Modal 
        isOpen={isScheduleMaintenanceModalOpen} 
        onClose={() => {setIsScheduleMaintenanceModalOpen(false); setEditingMaintenanceTask(null);}} 
        title={editingMaintenanceTask ? "Editar Tarea de Mtto." : "Programar Nueva Tarea de Mtto."}
        size="lg"
      >
        <MttoDispensadorForm 
          onSubmit={handleSaveMaintenanceTask} 
          onCancel={() => {setIsScheduleMaintenanceModalOpen(false); setEditingMaintenanceTask(null);}}
          dispensadores={[dispensador]} // Pass current or all available
          defaultDispensadorId={dispensador.iddispensador}
          initialData={editingMaintenanceTask}
          isEditMode={!!editingMaintenanceTask}
        />
      </Modal>
    </div>
  );
};

export default DispensadorDetailPage;
