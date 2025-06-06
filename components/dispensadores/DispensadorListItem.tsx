
import React from 'react';
import { Link } from 'react-router-dom';
import { Dispensador, DispensadorStatus } from '../../types';
import { formatDate } from '../../utils';
import Button from '../ui/Button';
import { EyeIcon, EditIcon, TrashIcon, CogIcon } from '../ui/Icon';

interface DispensadorListItemProps {
  dispensador: Dispensador;
  onEdit: (dispensador: Dispensador) => void;
  onDelete: (iddispensador: string) => void;
  onScheduleMaintenance: (dispensador: Dispensador) => void;
}

const getStatusColor = (status: DispensadorStatus): string => {
  switch (status) {
    case DispensadorStatus.ASIGNADO_A_TONEL:
      return 'bg-teal-200 text-teal-800';
    case DispensadorStatus.MANTENIMIENTO:
      return 'bg-yellow-200 text-yellow-800';
    case DispensadorStatus.FUERA_SERVICIO:
      return 'bg-red-300 text-red-900';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const DispensadorListItem: React.FC<DispensadorListItemProps> = ({ dispensador, onEdit, onDelete, onScheduleMaintenance }) => {
  return (
    <tr className="border-b border-brew-brown-200 hover:bg-brew-brown-100/50 transition-colors">
      <td className="px-5 py-3 text-sm text-brew-brown-700">
        <Link to={`/dispensadores/${dispensador.iddispensador}`} className="hover:underline text-brew-brown-600 font-semibold">
          {dispensador.nserial}
        </Link>
      </td>
      <td className="px-5 py-3 text-sm text-brew-brown-700">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(dispensador.status)}`}>
          {dispensador.status}
        </span>
      </td>
      <td className="px-5 py-3 text-sm text-brew-brown-700">{dispensador.location}</td>
      <td className="px-5 py-3 text-sm text-brew-brown-700">{formatDate(dispensador.acquired)}</td>
      <td className="px-5 py-3 text-sm">
        <div className="flex items-center space-x-1">
          <Link to={`/dispensadores/${dispensador.iddispensador}`}>
            <Button variant="ghost" size="sm" title="Ver Detalles">
              <EyeIcon size={18} />
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => onEdit(dispensador)} title="Editar Dispensador">
            <EditIcon size={18} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onScheduleMaintenance(dispensador)} title="Programar Mantenimiento">
            <CogIcon size={18} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(dispensador.iddispensador)} className="text-red-500 hover:text-red-700" title="Eliminar Dispensador">
            <TrashIcon size={18} />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default DispensadorListItem;
