
import React, { useState, useEffect } from 'react';
import { LocationFormData, Location } from '../../types';
//import { DEFAULT_TONEL_LOCATIONS, TONEL_STATUS_OPTIONS } from '../../constants'; // Corrected import name
import Input from '../ui/Input';
//import Select from '../ui/Select';
//import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
///import { getTodayDateString } from '../../utils';

interface LocationFormProps {
  onSubmit: (data: LocationFormData) => void;
  onCancel: () => void;
  initialData?: Location | null;
  isEditMode?: boolean;
}

const LocationForm: React.FC<LocationFormProps> = ({ onSubmit, onCancel, initialData, isEditMode = false }) => {
  const [formData, setFormData] = useState<LocationFormData>({
    location: '',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        location: initialData.location,
        description: initialData.description,
      });
    } else {
      // Reset for new location form
      setFormData({
        location: '',
        description: '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        label="Localidad"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Ej: Area1 Carnaval"
        required
      />
      <Input
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Ej: Descripcion"
        required
      />
      
      {isEditMode && (
      <>
        <Input
          label="Localidad"
          name="location"
          value={formData.location}
          onChange={handleChange} 
        />
        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
          
      </>
      )}
      
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          {isEditMode ? 'Guardar Cambios' : 'Registrar Local'}
        </Button>
      </div>
    </form>
  );
};

export default LocationForm;
