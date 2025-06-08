
import React, { useState, useEffect } from 'react';
import { Tonel, TonelStatus, TonelLocation } from '../../types';
import { TONEL_STATUS_OPTIONS, DEFAULT_TONEL_LOCATIONS } from '../../constants';
import Modal from '../ui/Modal';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
 

interface UpdateTonelStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  tonel: Tonel | null;
  onUpdate: (idtonel: string, status: TonelStatus, location: TonelLocation, notas?: string) => void;
}

const UpdateTonelStatusModal: React.FC<UpdateTonelStatusModalProps> = ({ isOpen, onClose, tonel, onUpdate }) => {
  const [status, setStatus] = useState<TonelStatus>(TonelStatus.VACIO);
  const [location, setLocation] = useState<TonelLocation>(TonelLocation.AREA_ALMACENAMIENTO);
  const [notas, setNotas] = useState<string>('');
 
  
 useEffect(() => {
    if (tonel) {
      setStatus(tonel.status);
      setLocation(tonel.location);
      setNotas(tonel.notas || '');
    }
  }, [tonel]);

  if (!tonel) return null;

  const handleSubmit = () => {
    onUpdate(tonel.idtonel, status, location, notas);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Actualizar Tonel: ${tonel.nserial}`}>
      <div className="space-y-4">
        <Select
          label="Nuevo Estado"
          options={TONEL_STATUS_OPTIONS}
          value={status}
          onChange={(e) => setStatus(e.target.value as TonelStatus)}
          required
        />
        <Select
          label="Nueva Ubicación"
          options={DEFAULT_TONEL_LOCATIONS}
          value={location}
          onChange={(e) => setLocation(e.target.value as TonelLocation)}
          required
        />
        <Textarea
          label="Notas (Opcional)"
          name="notas" // Add name attribute for consistency
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={3}
        />
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit}>Actualizar Tonel</Button>
      </div>
    </Modal>
  );
};

export default UpdateTonelStatusModal;
