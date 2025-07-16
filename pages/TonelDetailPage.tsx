import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Tonel, EventoTonel, MttoTonel, TonelFormData, TonelStatus, MttoTonelFormData, LoteProduccion } from '../types';
import { tonelService } from '../services/tonelService';
import { eventoService } from '../services/eventoService';
import { mttoTonelService } from '../services/mttoTonelService';
import { loteService } from '../services/loteService'; // To fetch associated lotes
import { formatDate } from '@/utils';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { EditIcon, PlusIcon, ArrowPathIcon } from '../components/ui/Icon';
import TonelEventos from '../components/toneles/TonelEventos';
import TonelEventoForm from '../components/toneles/TonelEventoForm';
import MttoTonelList from '../components/mantenimiento/MttoTonelList'; 
import Modal from '../components/ui/Modal';
import TonelForm from '../components/toneles/TonelForm';
import UpdateTonelStatusModal from '../components/toneles/UpdateTonelStatusModal';
import MttoTonelForm from '../components/mantenimiento/MttoTonelForm';


const TonelDetailPage: React.FC = () => {
  const { idtonel } = useParams<{ idtonel: string }>();
  const navigate = useNavigate();
  const [tonel, setTonel] = useState<Tonel | null>(null);
  const [eventos, setEventos] = useState<EventoTonel[]>([]);
  const [mttoToneles, setMttoToneles] = useState<MttoTonel[]>([]);
  const [lotesAsociados, setLotesAsociados] = useState<LoteProduccion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [isScheduleMaintenanceModalOpen, setIsScheduleMaintenanceModalOpen] = useState(false);
  const [editingMaintenanceTask, setEditingMaintenanceTask] = useState<MttoTonel | null>(null);
  const [showEventoForm, setShowEventoForm] = useState(false);

  const fetchData = useCallback(async () => {
    if (!idtonel) {
      setError("ID de Tonel no encontrado.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const tonelData = await tonelService.getTonelById(idtonel);
      if (!tonelData) {
        setError(`Tonel con ID ${idtonel} no encontrado.`);
        setTonel(null);
      } else {
        setTonel(tonelData);
        const [eventData, maintenanceData, lotesData] = await Promise.all([
          eventoService.getEventosByTonelId(idtonel),
          mttoTonelService.getMttoTonelesByTonelId(idtonel),
          loteService.getLotesByTonelId(idtonel), // Fetch lotes associated with this tonel
        ]);
        setEventos(eventData);
        setMttoToneles(maintenanceData);
        setLotesAsociados(lotesData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar detalles del tonel.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [idtonel]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateTonel = async (data: TonelFormData) => {
    if (!tonel) return;
    try {
      setIsLoading(true);
      await tonelService.updateTonel(tonel.idtonel, data);
      await fetchData(); 
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar detalles del tonel.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateTonelStatusLocation = async (idtonel: string, status: TonelStatus, newLocation: string, notas?: string) => {
    try {
      setIsLoading(true);
      await tonelService.updateTonelStatusLocation(idtonel, { status, location: newLocation, notas });
      await fetchData();
      setIsUpdateStatusModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar estado/ubicación del tonel.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMaintenanceTask = async (data: MttoTonelFormData) => {
    if (!tonel) return;
    try {
      setIsLoading(true);
      if (editingMaintenanceTask) {
        await mttoTonelService.updateMttoTonel(editingMaintenanceTask.idmtto, data);
      } else {
        await mttoTonelService.addMttoTonel({...data, idtonel: tonel.idtonel});
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

  const handleEditMaintenanceTask = (task: MttoTonel) => {
    setEditingMaintenanceTask(task);
    setIsScheduleMaintenanceModalOpen(true);
  };

  const handleDeleteMaintenanceTask = async (idmtto: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta tarea de mantenimiento?')) {
      try {
        setIsLoading(true);
        await mttoTonelService.deleteMttoTonel(idmtto);
        await fetchData();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar tarea de mantenimiento.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading && !tonel) return <div className="flex justify-center items-center h-64"><LoadingSpinner message="Cargando detalles del tonel..." /></div>;
  if (error && !tonel) return <p className="text-red-500 bg-red-100 p-4 rounded-md text-center">{error}</p>;
  if (!tonel) return (
    <div className="text-center py-10">
        <p className="text-brew-brown-600 text-xl mb-4">Tonel no encontrado.</p>
        <Link to="/toneles">
          <Button variant="primary">Volver a la Lista de Toneles</Button>
        </Link>
    </div>
    );

  const detailItem = (label: string, value?: React.ReactNode | null) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 border-t border-brew-brown-100 first:border-t-0">
      <dt className="text-sm font-medium text-brew-brown-500">{label}</dt>
      <dd className="mt-1 text-sm text-brew-brown-900 sm:mt-0 sm:col-span-2">{value || <span className="text-gray-400">N/A</span>}</dd>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-brew-brown-700">
          Detalles del Tonel: {tonel?.nserial}
        </h2>
        <div className="flex space-x-2 flex-wrap gap-2">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)} leftIcon={<EditIcon />} className="mr-2">
            Editar Tonel
          </Button>
          <Button variant="secondary" onClick={() => setIsUpdateStatusModalOpen(true)} leftIcon={<ArrowPathIcon />}>
            Actualizar Estado/Ubic.
          </Button>
        </div>
      </div>
      { isLoading && <LoadingSpinner message="Actualizando datos..." /> }
      { error && <p className="text-red-500 bg-red-100 p-3 rounded-md my-2">{error}</p> }


      <Card title="Información del Tonel">
        <dl>
          {detailItem("ID Sistema", tonel.idtonel)}
          {detailItem("NSerie", tonel.nserial)}
          {detailItem("Capacidad", `${tonel.capacity} Litros`)}
          {detailItem("Estado", tonel.status)}
          {detailItem("Ubicación Actual", tonel.location)}
          {detailItem("Fecha de Adquisición", formatDate(tonel.acquired))}
          {detailItem("Vida Útil Estimada", `${tonel.vidautil} años`)}
          {detailItem("Notas", tonel.notas ? <pre className="whitespace-pre-wrap font-sans text-sm">{tonel.notas}</pre> : null)}
          {/* We might want to show derived last/next maintenance from mttoToneles if not on Tonel directly */}
        </dl>
      </Card>

      <Card title="Lotes de Producción Asociados">
        {lotesAsociados.filter(lote => lote.idtonel === tonel?.idtonel).length === 0 ? (
          <p className="text-brew-brown-600">Este tonel no está asociado a ningún lote de producción actualmente.</p>
        ) : (
          <ul className="divide-y divide-brew-brown-100">
            {lotesAsociados.filter(lote => lote.idtonel === tonel?.idtonel).map(lote => (
              <li key={lote.idlote} className="py-2">
                <Link to={`/lotes/`} className="text-brew-brown-600 hover:underline">
                  {lote.lotename} ({lote.style}) - Estado: {lote.status}
                </Link>
                <p className="text-xs text-brew-brown-500">Vol: {lote.volumen}L | Prod: {formatDate(lote.entprod)}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Eventos del Tonel" actions={
          <Button variant={showEventoForm ? 'outline' : 'primary'} size="sm" onClick={() => setShowEventoForm(v => !v)} leftIcon={<PlusIcon />}>
            {showEventoForm ? 'Cerrar' : 'Registrar Evento'}
          </Button>
        }>
          {showEventoForm && tonel && ( 
            <TonelEventoForm idtonel={tonel.idtonel} onEventoAdded={() => { setShowEventoForm(false); fetchData(); }} onCancel={() => setShowEventoForm(false)} />
          )} 
          <TonelEventos eventos={eventos} tonel={tonel}/>
        </Card>

        <Card title="Mantenimiento Programado e Historial" actions={
            <Button variant="primary" size="sm" onClick={() => {setEditingMaintenanceTask(null); setIsScheduleMaintenanceModalOpen(true)}} leftIcon={<PlusIcon />}> 
              Nueva Tarea
            </Button>
        }>
          <MttoTonelList tasks={mttoToneles} toneles={[tonel]} onEditTask={handleEditMaintenanceTask} onDeleteTask={handleDeleteMaintenanceTask} />
        </Card>
      </div>
      
      <div className="mt-8">
        <Link to="/toneles">
          <Button variant="outline">Volver a Lista de Toneles</Button>
        </Link>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Detalles del Tonel" size="lg">
        <TonelForm onSubmit={handleUpdateTonel} onCancel={() => setIsEditModalOpen(false)} initialData={tonel} isEditMode />
      </Modal>

      {tonel && (
        <UpdateTonelStatusModal
          isOpen={isUpdateStatusModalOpen}
          onClose={() => setIsUpdateStatusModalOpen(false)}
          tonel={tonel}
          onUpdate={handleUpdateTonelStatusLocation}
        />
      )}
      
      {tonel && (
        <Modal 
          isOpen={isScheduleMaintenanceModalOpen} 
          onClose={() => {setIsScheduleMaintenanceModalOpen(false); setEditingMaintenanceTask(null);}} 
          title={editingMaintenanceTask ? "Editar Tarea de Mantenimiento" : "Programar Nueva Tarea de Mantenimiento"}
          size="lg"
        >
          <MttoTonelForm 
            onSubmit={handleSaveMaintenanceTask} 
            onCancel={() => {setIsScheduleMaintenanceModalOpen(false); setEditingMaintenanceTask(null);}}
            toneles={[tonel]} 
            defaultTonelId={tonel.idtonel}
            initialData={editingMaintenanceTask}
            isEditMode={!!editingMaintenanceTask}
          />
        </Modal>
      )}
    </div>
  );
};

export default TonelDetailPage;
