
import React from 'react';
import { EventoTonel } from '../../types';
import { formatDate } from '../../utils';
import Card from '../ui/Card';

interface TonelEventosProps {
  eventos: EventoTonel[];
}

const TonelEventos: React.FC<TonelEventosProps> = ({ eventos }) => {
  if (eventos.length === 0) {
    return <Card title="Historial de Eventos del Tonel"><p className="text-brew-brown-600">No se encontraron eventos para este tonel.</p></Card>;
  }

  return (
    <Card title="Historial de Eventos del Tonel">
      <ul className="space-y-3 max-h-96 overflow-y-auto">
        {eventos.map((evento) => (
          <li key={evento.idevento} className="p-3 bg-brew-brown-50 rounded-md border border-brew-brown-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-brew-brown-700">{evento.tipoevento}</span>
              <span className="text-xs text-brew-brown-500">{formatDate(evento.fechaevento, true)}</span>
            </div>
            {evento.descripcion && (
                <p className="text-sm text-brew-brown-600 mt-1">
                    Descripción: {evento.descripcion}
                </p>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default TonelEventos;
