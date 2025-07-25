
import React, { useState, useEffect } from 'react';
import { Dispensador, DispensadorFormData, DispensadorStatus, SelectOption } from '../../types';
import { DISPENSADOR_STATUS_OPTIONS } from '../../constants';
import { locationService } from '../../services/locationService';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { getTodayDateString } from '../../utils';

interface DispensadorFormProps {
  onSubmit: (data: DispensadorFormData) => void;
  onCancel: () => void;
  initialData?: Dispensador | null;
  isEditMode?: boolean;
}

const DispensadorForm: React.FC<DispensadorFormProps> = ({ onSubmit, onCancel, initialData, isEditMode = false }) => {
  const getDefaultStatus = (): DispensadorStatus => {
    return (DISPENSADOR_STATUS_OPTIONS.length > 0 
            ? DISPENSADOR_STATUS_OPTIONS[0].value 
            : Object.values(DispensadorStatus)[0]) as DispensadorStatus;
  };
  const [locationOptions, setLocationOptions] = useState<SelectOption[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const [formData, setFormData] = useState<DispensadorFormData>({
    nserial: '',
    status: getDefaultStatus(),
    location: '',
    acquired: getTodayDateString(),
    notas: '',
  });

  useEffect(() => {
    setLoadingLocations(true);
    locationService.getAllLocation()
      .then((locations) => {
        const opts = locations.map((loc) => ({ value: loc.location, label: loc.location }));
        setLocationOptions(opts);
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
        status: initialData.status,
        location: initialData.location,
        acquired: initialData.acquired.split('T')[0],
        notas: initialData.notas || '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        placeholder="Ej: DISP-001-ABC"
        required
      />
      <Select
        label="Estado"
        name="status"
        value={formData.status}
        onChange={handleChange}
        options={DISPENSADOR_STATUS_OPTIONS}
        required
      />
      <Select
        label="Ubicación"
        name="location"
        value={formData.location}
        onChange={handleChange}
        options={locationOptions}
        required
        disabled={loadingLocations}
      />
      <Input
        label="Fecha de Adquisición"
        name="acquired"
        type="date"
        value={formData.acquired}
        onChange={handleChange}
        required
      />
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
          {isEditMode ? 'Guardar Cambios' : 'Registrar Dispensador'}
        </Button>
      </div>
    </form>
  );
};

export default DispensadorForm;
