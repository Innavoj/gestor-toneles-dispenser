
import React, { useState, useEffect } from 'react';
import { Tonel, TonelFormData, TonelLocation, TonelStatus } from '../../types';
import { DEFAULT_TONEL_LOCATIONS, TONEL_STATUS_OPTIONS } from '../../constants'; // Corrected import name
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { getTodayDateString } from '../../utils';

interface TonelFormProps {
  onSubmit: (data: TonelFormData) => void;
  onCancel: () => void;
  initialData?: Tonel | null;
  isEditMode?: boolean;
}

const TonelForm: React.FC<TonelFormProps> = ({ onSubmit, onCancel, initialData, isEditMode = false }) => {
  const [formData, setFormData] = useState<TonelFormData>({
    nserial: '',
    capacity: 50, // Default capacity
    // material is removed
    acquired: getTodayDateString(),
    vidautil: 10, // Default useful life in years, adjust as needed
    status: TonelStatus.VACIO,
    location: TonelLocation.AREA_ALMACENAMIENTO,
    notas: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nserial: initialData.nserial,
        capacity: initialData.capacity,
        acquired: initialData.acquired.split('T')[0], // Format for date input
        vidautil: initialData.vidautil,
        status: initialData.status,
        location: initialData.location,
        notas: initialData.notas || '',
      });
    } else {
      // Reset for new tonel form
      setFormData({
        nserial: '',
        capacity: 50,
        acquired: getTodayDateString(),
        vidautil: 10, 
        status: TonelStatus.VACIO,
        location: TonelLocation.AREA_ALMACENAMIENTO,
        notas: '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: (name === 'capacity' || name === 'vidautil') ? parseFloat(value) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Número de Serie (NSerial)"
        name="nserial"
        value={formData.nserial}
        onChange={handleChange}
        placeholder="Ej: TONEL-001-XYZ"
        required
      />
      <Input
        label="Capacidad (Litros)"
        name="capacity"
        type="number"
        value={formData.capacity.toString()}
        onChange={handleChange}
        required
        min="1"
      />
      <Input
        label="Fecha de Adquisición"
        name="acquired"
        type="date"
        value={formData.acquired}
        onChange={handleChange}
        required
      />
      <Input
        label="Vida Útil (años)"
        name="vidautil"
        type="number"
        value={formData.vidautil.toString()}
        onChange={handleChange}
        required
        min="1"
      />
      {isEditMode && (
        <>
          <Select
            label="Estado"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={TONEL_STATUS_OPTIONS}
            required
          />
          <Select
            label="Ubicación Actual"
            name="location"
            value={formData.location}
            onChange={handleChange}
            options={DEFAULT_TONEL_LOCATIONS} 
            required
          />
        </>
      )}
      <Textarea
        label="Notas Adicionales"
        name="notas"
        value={formData.notas}
        onChange={handleChange}
        rows={3}
      />
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          {isEditMode ? 'Guardar Cambios' : 'Registrar Tonel'}
        </Button>
      </div>
    </form>
  );
};

export default TonelForm;
