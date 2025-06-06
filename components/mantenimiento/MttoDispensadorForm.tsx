
import React, { useState, useEffect } from 'react';
import { MttoDispensador, MttoDispensadorFormData, MttoTaskStatus, Dispensador, MttoDispensadorTipo } from '../../types';
import { MTTO_TASK_STATUS_OPTIONS, MTTO_DISPENSADOR_TIPO_OPTIONS } from '../../constants';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { getTodayDateString } from '../../utils';

interface MttoDispensadorFormProps {
  onSubmit: (data: MttoDispensadorFormData) => void;
  onCancel: () => void;
  dispensadores: Dispensador[]; 
  initialData?: MttoDispensador | null;
  defaultDispensadorId?: string;
  isEditMode?: boolean;
}

const MttoDispensadorForm: React.FC<MttoDispensadorFormProps> = ({ 
  onSubmit, 
  onCancel, 
  dispensadores, 
  initialData, 
  defaultDispensadorId,
  isEditMode = false 
}) => {
  const getDefaultTipoMtto = (): MttoDispensadorTipo => {
    return (MTTO_DISPENSADOR_TIPO_OPTIONS.length > 0 
            ? MTTO_DISPENSADOR_TIPO_OPTIONS[0].value 
            : Object.values(MttoDispensadorTipo)[0]) as MttoDispensadorTipo;
  };

  const [formData, setFormData] = useState<MttoDispensadorFormData>({
    iddispensador: defaultDispensadorId || (dispensadores.length > 0 ? dispensadores[0].iddispensador : ''),
    tipomtto: getDefaultTipoMtto(),
    fechaini: getTodayDateString(),
    status: MttoTaskStatus.PROGRAMADO,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        iddispensador: initialData.iddispensador,
        tipomtto: initialData.tipomtto,
        fechaini: initialData.fechaini.split('T')[0],
        fechafin: initialData.fechafin?.split('T')[0],
        status: initialData.status,
      });
    } else {
        const newDefaultIdDispensador = defaultDispensadorId || (dispensadores.length > 0 ? dispensadores[0].iddispensador : '');
        setFormData(prev => ({
           iddispensador: newDefaultIdDispensador,
           tipomtto: getDefaultTipoMtto(),
           fechaini: getTodayDateString(),
           status: MttoTaskStatus.PROGRAMADO,
           // No fechafin on new/default
        }));
    }
  }, [initialData, defaultDispensadorId, dispensadores]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    if (dataToSubmit.status !== MttoTaskStatus.COMPLETADO) {
        delete dataToSubmit.fechafin; 
    } else if (!dataToSubmit.fechafin) {
        dataToSubmit.fechafin = getTodayDateString(); 
    }
    onSubmit(dataToSubmit);
  };

  const dispensadorOptions = dispensadores.map(d => ({
    value: d.iddispensador,
    label: d.nserial
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        label="Dispensador"
        name="iddispensador"
        value={formData.iddispensador}
        onChange={handleChange}
        options={dispensadorOptions}
        required
        disabled={isEditMode || !!defaultDispensadorId || dispensadores.length === 0} 
      />
      <Select
        label="Tipo de Mantenimiento"
        name="tipomtto"
        value={formData.tipomtto}
        onChange={handleChange}
        options={MTTO_DISPENSADOR_TIPO_OPTIONS}
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
            disabled={formData.status !== MttoTaskStatus.COMPLETADO && formData.status !== MttoTaskStatus.CANCELADO}
         />
        </>
      )}
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

export default MttoDispensadorForm;
