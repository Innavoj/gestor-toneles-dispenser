
import React, { useState } from 'react';
import { EventoTonel, Tonel } from '../../types';
import { formatDate } from '../../utils';

interface TonelEventosTableProps {
  eventos: EventoTonel[];
  toneles: Tonel[];
}

const PAGE_SIZE = 5;

const TonelEventosTable: React.FC<TonelEventosTableProps> = ({ eventos, toneles }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(eventos.length / PAGE_SIZE);
  const paginatedEventos = eventos.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-brew-brown-200 bg-white">
        <thead className="bg-brew-brown-100">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-brew-brown-500 uppercase tracking-wider">Fecha</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-brew-brown-500 uppercase tracking-wider">Tonel</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-brew-brown-500 uppercase tracking-wider">Tipo de Evento</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-brew-brown-500 uppercase tracking-wider">Descripción</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-brew-brown-200">
          {paginatedEventos.length === 0 && (
            <tr><td colSpan={4} className="text-center py-4 text-brew-brown-500">No hay eventos registrados.</td></tr>
          )}
          {paginatedEventos.map(ev => {
            const tonel = toneles.find(t => t.idtonel === ev.idtonel);
            return (
              <tr key={ev.idevento}>
                <td className="px-4 py-2 text-sm">{formatDate(ev.fechaevento)}</td>
                <td className="px-4 py-2 text-sm">{tonel ? tonel.nserial : ev.idtonel}</td>
                <td className="px-4 py-2 text-sm">{ev.tipoevento}</td>
                <td className="px-4 py-2 text-sm">{ev.descripcion || '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-2">
          <button
            className="px-3 py-1 rounded bg-brew-brown-100 text-brew-brown-600 disabled:opacity-50"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >Anterior</button>
          <span className="text-brew-brown-700 font-semibold">Página {currentPage} de {totalPages}</span>
          <button
            className="px-3 py-1 rounded bg-brew-brown-100 text-brew-brown-600 disabled:opacity-50"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >Siguiente</button>
        </div>
      )}
    </div>
  );
};

export default TonelEventosTable;
