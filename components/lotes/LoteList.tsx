
import React from 'react';
import { LoteProduccion, LoteProduccionStatus, Tonel } from '../../types';
import { formatDate } from '../../utils';
import Button from '../ui/Button';
import { EditIcon, TrashIcon } from '../ui/Icon';

interface LoteListProps {
  lotes: LoteProduccion[];
  toneles: Tonel[]; // To display NSerial of associated tonel
  onEditLote: (lote: LoteProduccion) => void;
  onDeleteLote: (idlote: string) => void;
}

const getStatusColor = (status: LoteProduccionStatus): string => {
  switch (status) {
    case LoteProduccionStatus.PLANEADO:
      return 'bg-gray-200 text-gray-700';
    case LoteProduccionStatus.FERMENTANDO:
    case LoteProduccionStatus.PRODUCION: // Assuming 'produccion'
      return 'bg-yellow-200 text-yellow-800';
    case LoteProduccionStatus.LISTO_PARA_ENVASAR:
      return 'bg-blue-200 text-blue-800';
    case LoteProduccionStatus.COMPLETADO:
      return 'bg-green-200 text-green-800';
    default: // Should not happen with defined enums
      return 'bg-gray-100 text-gray-800';
  }
};

const LoteList: React.FC<LoteListProps> = ({ lotes, toneles, onEditLote, onDeleteLote }) => {
  if (lotes.length === 0) {
    return <p className="text-center text-brew-brown-600 py-8">No hay lotes de producción registrados. Añada uno para comenzar.</p>;
  }

  const getTonelNSerial = (idtonel: string): string => {
    const tonel = toneles.find(t => t.idtonel === idtonel);
    return tonel ? tonel.nserial : idtonel.substring(0,8) + '...';
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-brew-brown-200 bg-white">
        <thead className="bg-brew-brown-100">
          <tr>
            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-brew-brown-500 uppercase tracking-wider">ID Lote</th>
            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-brew-brown-500 uppercase tracking-wider">Nombre Lote</th>
            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-brew-brown-500 uppercase tracking-wider">Estilo</th>
            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-brew-brown-500 uppercase tracking-wider">Volumen (L)</th>
            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-brew-brown-500 uppercase tracking-wider">Estado</th>
            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-brew-brown-500 uppercase tracking-wider">F. Entrada Prod.</th>
            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-brew-brown-500 uppercase tracking-wider">Tonel Asociado</th>
            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-brew-brown-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-brew-brown-200">
          {lotes.map((lote) => (
            <tr key={lote.idlote} className="hover:bg-brew-brown-100/50 transition-colors">
              <td className="px-5 py-3 text-sm text-brew-brown-700 font-medium">{lote.idlote.substring(0,8)}...</td>
              <td className="px-5 py-3 text-sm text-brew-brown-700">{lote.lotename}</td>
              <td className="px-5 py-3 text-sm text-brew-brown-700">{lote.style}</td>
              <td className="px-5 py-3 text-sm text-brew-brown-700">{lote.volumen}L</td>
              <td className="px-5 py-3 text-sm text-brew-brown-700">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lote.status)}`}>
                  {lote.status}
                </span>
              </td>
              <td className="px-5 py-3 text-sm text-brew-brown-700">{formatDate(lote.entprod)}</td>
              <td className="px-5 py-3 text-sm text-brew-brown-700">{getTonelNSerial(lote.idtonel)}</td>
              <td className="px-5 py-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEditLote(lote)} title="Editar Lote">
                    <EditIcon size={18} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDeleteLote(lote.idlote)} className="text-red-500 hover:text-red-700" title="Eliminar Lote">
                    <TrashIcon size={18} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoteList;
