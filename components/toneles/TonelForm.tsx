
import React, { useState, useEffect } from 'react';
import { Tonel, TonelFormData, TonelStatus, SelectOption } from '../../types';
import { TONEL_STATUS_OPTIONS } from '../../constants';
import { locationService } from '../../services/locationService';
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
    acquired: getTodayDateString(),
    vidautil: 10, // Default useful life in years, adjust as needed
    status: TonelStatus.VACIO,
    location: '',
    notas: '',
  });
  const [locationOptions, setLocationOptions] = useState<SelectOption[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    setLoadingLocations(true);
    locationService.getAllLocation()
      .then((locations) => {
        const opts = locations.map((loc) => ({ value: loc.location, label: loc.location }));
        setLocationOptions(opts);
        // Si no hay initialData, setear la primera ubicación como default
        if (!initialData && opts.length > 0) {
          setFormData(prev => ({ ...prev, location: opts[0].value }));
        }
      })
      .catch(() => {
        setLocationOptions([]);
      })
      .finally(() => setLoadingLocations(false));
  }, [initialData]);

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
      <Select
            label="Ubicación Actual"
            name="location"
            value={formData.location}
            onChange={handleChange}
            options={locationOptions}
            required
            
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
          {/* <Select
            label="Ubicación Actual"
            name="location"
            value={formData.location}
            onChange={handleChange}
            options={locationOptions}
            required
            disabled={loadingLocations}
          /> */}
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
