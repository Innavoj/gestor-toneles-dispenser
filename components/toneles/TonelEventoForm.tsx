import React, { useState } from 'react';
import { EventoTonelTipo } from '../../types';
import { eventoService } from '../../services/eventoService';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface TonelEventoFormProps {
  idtonel: string;
  onEventoAdded: () => void;
  onCancel?: () => void;
}

const EVENTO_OPTIONS = [
  { value: EventoTonelTipo.INSPECCION, label: 'Inspección' },
  { value: EventoTonelTipo.LIMPIEZA_INICIADA, label: 'Limpieza Iniciada' },
  { value: EventoTonelTipo.LIMPIEZA_FINALIZADA, label: 'Limpieza Finalizada' },
  { value: EventoTonelTipo.TRASLADO, label: 'Traslado' },
  { value: EventoTonelTipo.ENTRADA, label: 'Entrada' },
  { value: EventoTonelTipo.SALIDA, label: 'Salida' },
];

const TonelEventoForm: React.FC<TonelEventoFormProps> = ({ idtonel, onEventoAdded, onCancel }) => {
  const [tipoevento, setTipoevento] = useState<string>(EVENTO_OPTIONS[0]?.value || '');
  const [descripcion, setDescripcion] = useState('');
  const [fechaevento, setFechaevento] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await eventoService.addEventoTonel({ idtonel, tipoevento: tipoevento as EventoTonelTipo, descripcion, fechaevento });
      setTipoevento(EVENTO_OPTIONS[0]?.value || '');
      setDescripcion('');
      setFechaevento(new Date().toISOString().slice(0, 10));
      onEventoAdded();
    } catch (err: any) {
      setError(err.message || 'Error al guardar evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Tipo de Evento"
        value={tipoevento}
        onChange={e => setTipoevento(e.target.value)}
        options={EVENTO_OPTIONS}
        required
      />
      <Input
        label="Fecha del Evento"
        name="fechaevento"
        type="date"
        value={fechaevento}
        onChange={e => setFechaevento(e.target.value)}
        required
      />
      <Textarea
        label="Descripción (opcional)"
        value={descripcion}
        onChange={e => setDescripcion(e.target.value)}
        rows={2}
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex space-x-2 justify-end">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
        <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Guardando...' : 'Registrar Evento'}</Button>
      </div>
    </form>
  );
};

export default TonelEventoForm;
