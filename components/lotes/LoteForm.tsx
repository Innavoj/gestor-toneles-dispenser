
import React, { useState, useEffect } from 'react';
import { LoteProduccion, LoteProduccionFormData, LoteProduccionStatus, LoteProduccionStyle, Tonel } from '../../types';
import { LOTE_STATUS_OPTIONS, LOTE_STYLE_OPTIONS } from '../../constants';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea'; // Assuming 'notas' could be added to LoteProduccion if needed, currently not in SQL
import Button from '../ui/Button';
import { getTodayDateString } from '../../utils';

interface LoteFormProps {
  onSubmit: (data: LoteProduccionFormData) => void;
  onCancel: () => void;
  toneles: Tonel[]; // To select the tonel for the lote
  initialData?: LoteProduccion | null;
  isEditMode?: boolean;
}

const LoteForm: React.FC<LoteFormProps> = ({ onSubmit, onCancel, toneles, initialData, isEditMode = false }) => {
  const getDefaultStyle = (): LoteProduccionStyle => {
    return (LOTE_STYLE_OPTIONS.length > 0 
            ? LOTE_STYLE_OPTIONS[0].value 
            : Object.values(LoteProduccionStyle)[0]) as LoteProduccionStyle;
  };
  
  const [formData, setFormData] = useState<LoteProduccionFormData>({
    idtonel: toneles.length > 0 ? toneles[0].idtonel : '',
    lotename: '',
    style: getDefaultStyle(),
    volumen: 1000, // Default volume
    entprod: getTodayDateString(),
    status: LoteProduccionStatus.PLANEADO,
    // salprod is optional, usually set on completion/packaging
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        idtonel: initialData.idtonel,
        lotename: initialData.lotename,
        style: initialData.style,
        volumen: initialData.volumen,
        entprod: initialData.entprod.split('T')[0],
        salprod: initialData.salprod?.split('T')[0],
        status: initialData.status,
      });
    } else {
       setFormData(prev => ({
        idtonel: toneles.length > 0 ? toneles[0].idtonel : '',
        lotename: '',
        style: getDefaultStyle(),
        volumen: 1000,
        entprod: getTodayDateString(),
        status: LoteProduccionStatus.PLANEADO,
        salprod: undefined,
      }));
    }
  }, [initialData, toneles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: (name === 'volumen') ? parseFloat(value) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = {...formData};
    // Ensure salprod is not sent if status doesn't warrant it, or backend handles null
    if (dataToSubmit.status !== LoteProduccionStatus.COMPLETADO && dataToSubmit.status !== LoteProduccionStatus.LISTO_PARA_ENVASAR) {
        delete dataToSubmit.salprod;
    } else if ((dataToSubmit.status === LoteProduccionStatus.COMPLETADO || dataToSubmit.status === LoteProduccionStatus.LISTO_PARA_ENVASAR) && !dataToSubmit.salprod) {
        // Optionally set salprod to today if completed and not set, or leave to backend
        // dataToSubmit.salprod = getTodayDateString(); 
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
        label="Tonel para el Lote"
        name="idtonel"
        value={formData.idtonel}
        onChange={handleChange}
        options={tonelOptions}
        required
        disabled={isEditMode || toneles.length === 0} // Cannot change tonel once set or if no toneles
      />
      <Input
        label="Nombre del Lote"
        name="lotename"
        value={formData.lotename}
        onChange={handleChange}
        required
        placeholder="Ej: IPA Verano 2024"
      />
      <Select
        label="Estilo de Cerveza"
        name="style"
        value={formData.style}
        onChange={handleChange}
        options={LOTE_STYLE_OPTIONS}
        required
      />
      <Input
        label="Volumen Producido (Litros)"
        name="volumen"
        type="number"
        value={formData.volumen.toString()}
        onChange={handleChange}
        required
        min="1"
      />
      <Input
        label="Fecha de Entrada a Producción"
        name="entprod"
        type="date" // SQL is DATETIME, but form usually takes DATE. Backend should handle time part or assume start of day.
        value={formData.entprod}
        onChange={handleChange}
        required
      />
      {isEditMode && (
        <>
          <Input
            label="Fecha de Salida de Producción"
            name="salprod"
            type="date"
            value={formData.salprod || ''}
            onChange={handleChange}
            // Enable only if status is appropriate (e.g., completado, listo para envasar)
            disabled={formData.status !== LoteProduccionStatus.COMPLETADO && formData.status !== LoteProduccionStatus.LISTO_PARA_ENVASAR}
          />
          <Select
            label="Estado"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={LOTE_STATUS_OPTIONS}
            required
          />
        </>
      )}
      {/* Notas was not in lotesproduccion SQL, can add if needed using Textarea */}
      {/* <Textarea label="Notas" name="notas" value={formData.notas} onChange={handleChange} /> */}
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          {isEditMode ? 'Guardar Cambios' : 'Registrar Lote'}
        </Button>
      </div>
    </form>
  );
};

export default LoteForm;
