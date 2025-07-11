
import React from 'react';
import { Link } from 'react-router-dom';
import { Tonel, TonelStatus } from '../../types';
import { formatDate } from '../../utils';
import Button from '../ui/Button';
import { EditIcon, TrashIcon, EyeIcon, ArrowPathIcon, CogIcon } from '../ui/Icon';

interface TonelListItemProps {
  tonel: Tonel;
  onDelete: (idtonel: string) => void;
  onUpdateStatus: (tonel: Tonel) => void; // For opening UpdateTonelStatusModal
  onScheduleMaintenance: (tonel: Tonel) => void;
}

const getStatusColor = (status: TonelStatus): string => {
  // Adjust colors based on new statuses if needed
  switch (status) {
    case TonelStatus.VACIO:
      return 'bg-gray-200 text-gray-700';
    case TonelStatus.LLENO:
      return 'bg-green-200 text-green-800';
    case TonelStatus.ASIGNADO_A_DISPENSER:
      return 'bg-teal-200 text-teal-800';
    case TonelStatus.MANTENIMIENTO:
      return 'bg-yellow-200 text-yellow-800';
    case TonelStatus.FUERA_SERVICIO:
      return 'bg-red-300 text-red-900';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const TonelListItem: React.FC<TonelListItemProps> = ({ tonel, onDelete, onUpdateStatus, onScheduleMaintenance }) => {
  return (
    <tr className="border-b border-brew-brown-200 hover:bg-brew-brown-100/50 transition-colors">
      <td className="px-5 py-3 text-sm text-brew-brown-700">
        <Link to={`/toneles/${tonel.idtonel}`} className="hover:underline text-brew-brown-600 font-semibold">
          {tonel.nserial}
        </Link>
      </td>
      <td className="px-5 py-3 text-sm text-brew-brown-700">{tonel.capacity}L</td>
      <td className="px-5 py-3 text-sm text-brew-brown-700">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tonel.status)}`}>
          {tonel.status}
        </span>
      </td>
      <td className="px-5 py-3 text-sm text-brew-brown-700">{tonel.location}</td>
      <td className="px-5 py-3 text-sm text-brew-brown-700">{/* Current Lote ID if available from backend */}
        {tonel.currentLoteId ? tonel.currentLoteId.substring(0,8) + '...' : 'N/A'}
      </td>
      <td className="px-5 py-3 text-sm text-brew-brown-700">{formatDate(tonel.acquired)}</td>
      <td className="px-5 py-3 text-sm">
        <div className="flex items-center space-x-1">
          <Link to={`/toneles/${tonel.idtonel}`}>
            <Button variant="ghost" size="sm" title="Ver Detalles">
              <EyeIcon size={18} />
            </Button>
          </Link>
           <Button variant="ghost" size="sm" onClick={() => onUpdateStatus(tonel)} title="Actualizar Estado/Ubicación">
             <ArrowPathIcon size={18} />
           </Button>
           <Button variant="ghost" size="sm" onClick={() => onScheduleMaintenance(tonel)} title="Programar Mantenimiento">
             <CogIcon size={18} />
           </Button>
          {/* Edit button was removed from list item, usually on detail page or modal */}
          {/* <Button variant="ghost" size="sm" onClick={() => onEdit(tonel)} title="Editar Tonel"><EditIcon size={18}/></Button>  */}
          <Button variant="ghost" size="sm" onClick={() => onDelete(tonel.idtonel)} className="text-red-500 hover:text-red-700" title="Eliminar Tonel">
            <TrashIcon size={18} />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default TonelListItem;
