
import React, { useState, useEffect } from 'react';
import { MttoTonel, MttoTonelFormData, MttoTaskStatus, Tonel, MttoTonelTipo } from '../../types';
import { MTTO_TASK_STATUS_OPTIONS, MTTO_TONEL_TIPO_OPTIONS } from '../../constants';
import Input from '../ui/Input';
import Select from '../ui/Select';
// Textarea might not be needed if 'notas' or 'descripcion' are not in MttoTonel SQL
import Button from '../ui/Button';
import { getTodayDateString } from '../../utils';

interface MttoTonelFormProps {
  onSubmit: (data: MttoTonelFormData) => void;
  onCancel: () => void;
  toneles: Tonel[]; // For selecting a tonel
  initialData?: MttoTonel | null;
  defaultTonelId?: string; // Pre-select tonel if scheduling from tonel view
  isEditMode?: boolean;
}

const MttoTonelForm: React.FC<MttoTonelFormProps> = ({ 
  onSubmit, 
  onCancel, 
  toneles, 
  initialData, 
  defaultTonelId,
  isEditMode = false 
}) => {
  const getDefaultTipoMtto = (): MttoTonelTipo => {
    return (MTTO_TONEL_TIPO_OPTIONS.length > 0 
            ? MTTO_TONEL_TIPO_OPTIONS[0].value 
            : Object.values(MttoTonelTipo)[0]) as MttoTonelTipo;
  };
  
  const [formData, setFormData] = useState<MttoTonelFormData>({
    idtonel: defaultTonelId || (toneles.length > 0 ? toneles[0].idtonel : ''),
    tipomtto: getDefaultTipoMtto(),
    fechaini: getTodayDateString(),
    status: MttoTaskStatus.PROGRAMADO,
    // fechafin is optional and usually set on completion
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        idtonel: initialData.idtonel,
        tipomtto: initialData.tipomtto,
        fechaini: initialData.fechaini.split('T')[0],
        fechafin: initialData.fechafin?.split('T')[0],
        status: initialData.status,
      });
    } else {
        const newDefaultIdTonel = defaultTonelId || (toneles.length > 0 ? toneles[0].idtonel : '');
        setFormData(prev => ({
            idtonel: newDefaultIdTonel,
            tipomtto: getDefaultTipoMtto(),
            fechaini: getTodayDateString(),
            status: MttoTaskStatus.PROGRAMADO,
            // No fechafin on new/default
        }));
    }
  }, [initialData, defaultTonelId, toneles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    if (dataToSubmit.status !== MttoTaskStatus.COMPLETADO) {
        delete dataToSubmit.fechafin; // Only send fechafin if completed, or backend handles it
    } else if (!dataToSubmit.fechafin) {
        dataToSubmit.fechafin = getTodayDateString(); // Default completion date to today if status is completed and not set
    }
    onSubmit(dataToSubmit);
  };

  const tonelOptions = toneles.map(tonel => ({
    value: tonel.idtonel,
    label: `${tonel.nserial} (${tonel.capacity}L)`
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        label="Tonel"
        name="idtonel"
        value={formData.idtonel}
        onChange={handleChange}
        options={tonelOptions}
        required
        disabled={isEditMode || !!defaultTonelId || toneles.length === 0} 
      />
      <Select
        label="Tipo de Mantenimiento"
        name="tipomtto"
        value={formData.tipomtto}
        onChange={handleChange}
        options={MTTO_TONEL_TIPO_OPTIONS}
        required
      />
      <Input
        label="Fecha de Inicio"
        name="fechaini"
        type="date"
        value={formData.fechaini}
        onChange={handleChange}
        required
      />
      {isEditMode && (
        <>
        <Select
            label="Estado"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={MTTO_TASK_STATUS_OPTIONS}
            required
         />
        <Input
            label="Fecha de Fin (si aplica)"
            name="fechafin"
            type="date"
            value={formData.fechafin || ''}
            onChange={handleChange}
            disabled={formData.status !== MttoTaskStatus.COMPLETADO && formData.status !== MttoTaskStatus.CANCELADO} // Enable if completed or cancelled
         />
        </>
      )}
      {/* Notas and Cost were removed from MttoTonel based on SQL schema */}
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          {isEditMode ? 'Guardar Cambios' : 'Programar Tarea'}
        </Button>
      </div>
    </form>
  );
};

export default MttoTonelForm;
