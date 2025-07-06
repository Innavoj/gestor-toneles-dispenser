import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoteProduccion, LoteProduccionFormData, Tonel } from '../types';
import { loteService } from '../services/loteService';
import { tonelService } from '../services/tonelService'; // To fetch toneles for the form
import LoteList from '../components/lotes/LoteList';
import LoteForm from '../components/lotes/LoteForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { PlusIcon } from '../components/ui/Icon';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const LoteManagementPage: React.FC = () => {
  const [lotes, setLotes] = useState<LoteProduccion[]>([]);
  const [toneles, setToneles] = useState<Tonel[]>([]); // For LoteForm select
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingLote, setEditingLote] = useState<LoteProduccion | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [lotesData, tonelesData] = await Promise.all([
        loteService.getAllLotes(),
        tonelService.getAllToneles() // Fetch toneles for the form dropdown
      ]);
      setLotes(lotesData.sort((a,b) => new Date(b.entprod).getTime() - new Date(a.entprod).getTime()));
      setToneles(tonelesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar lotes de producción o toneles.');
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


  const handleOpenFormModal = (lote: LoteProduccion | null = null) => {
    setEditingLote(lote);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setEditingLote(null);
    setIsFormModalOpen(false);
  };

  const handleSubmitLote = async (data: LoteProduccionFormData) => {
    try {
      setIsLoading(true); // Consider moving setIsLoading inside modal or use separate loading for modal
      if (editingLote) {
        await loteService.updateLote(editingLote.idlote, data);
      } else {
        await loteService.addLote(data);
      }
      await fetchData(); // Refetch all data
      handleCloseFormModal();
    } catch (err) {
      setError(err instanceof Error ? (editingLote ? 'Error al actualizar el lote.' : 'Error al registrar el lote.') : 'Ocurrió un error inesperado.');
      console.error(err);
      // Keep modal open on error for correction, or display error in modal
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLote = async (idlote: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este lote de producción?')) {
      try {
        setIsLoading(true);
        await loteService.deleteLote(idlote);
        await fetchData(); // Refetch
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar el lote.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl py-6 font-bold text-brew-brown-700">Gestión de Lotes de Producción</h2>
        <Button onClick={() => handleOpenFormModal()} variant="primary" leftIcon={<PlusIcon />}>
          Registrar Nuevo Lote
        </Button>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

      {isLoading && !isFormModalOpen ? ( // Avoid full page spinner if modal is for loading its own content
        <LoadingSpinner message="Cargando lotes..." />
      ) : (
        <LoteList 
            lotes={lotes} 
            toneles={toneles}
            onEditLote={handleOpenFormModal} 
            onDeleteLote={handleDeleteLote} 
        />
      )}

      {isFormModalOpen && (
        <Modal 
          isOpen={isFormModalOpen} 
          onClose={handleCloseFormModal} 
          title={editingLote ? 'Editar Lote de Producción' : 'Registrar Nuevo Lote de Producción'}
          size="lg"
        >
          {toneles.length > 0 ? (
            <LoteForm 
                onSubmit={handleSubmitLote} 
                onCancel={handleCloseFormModal} 
                toneles={toneles}
                initialData={editingLote}
                isEditMode={!!editingLote}
            />
          ) : (
            <div className="p-4 text-center">
              <p className="text-brew-brown-600 mb-4">No hay toneles disponibles para asignar al lote. Por favor, registre un tonel primero.</p>
              <Button onClick={handleCloseFormModal} variant="primary">Entendido</Button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default LoteManagementPage;
