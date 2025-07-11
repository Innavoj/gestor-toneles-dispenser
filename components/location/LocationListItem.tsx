
import React from 'react';
import { Link } from 'react-router-dom';
import { Location, TonelStatus } from '../../types';
import { formatDate } from '../../utils';
import Button from '../ui/Button';
import { EditIcon, TrashIcon, EyeIcon, ArrowPathIcon, CogIcon } from '../ui/Icon';

interface LocationListItemProps {
  local: Location;
  onDelete: (idlocation: string) => void;
 // onUpdateStatus: (tonel: Tonel) => void; // For opening UpdateTonelStatusModal
 // onScheduleMaintenance: (tonel: Tonel) => void;
}

// const getStatusColor = (status: TonelStatus): string => {
//   // Adjust colors based on new statuses if needed
//   switch (status) {
//     case TonelStatus.VACIO:
//       return 'bg-gray-200 text-gray-700';
//     case TonelStatus.LLENO:
//       return 'bg-green-200 text-green-800';
//     case TonelStatus.ASIGNADO_A_DISPENSER:
//       return 'bg-teal-200 text-teal-800';
//     case TonelStatus.MANTENIMIENTO:
//       return 'bg-yellow-200 text-yellow-800';
//     case TonelStatus.FUERA_SERVICIO:
//       return 'bg-red-300 text-red-900';
//     default:
//       return 'bg-gray-100 text-gray-800';
//   }
// };

const LocationListItem: React.FC<LocationListItemProps> = ({ local, onDelete }) => {
  return (
    <tr className="border-b border-brew-brown-200 hover:bg-brew-brown-100/50 transition-colors">
      <td className="px-5 py-3 text-sm text-brew-brown-700">
        <Link to={`/location/${local.idlocation}`} className="hover:underline text-brew-brown-600 font-semibold">
          {local.location}
        </Link>
      </td>
      <td className="px-5 py-3 text-sm text-brew-brown-700">{local.description}</td>
      {/* <td className="px-5 py-3 text-sm text-brew-brown-700">
         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tonel.status)}`}>
          {tonel.status}
        </span> 
      </td> */}
   
        <td className="px-5 py-3 text-sm">
          <div className="flex items-center space-x-1">
            <Link to={`/location/${local.idlocation}`}>
              {/* <Button variant="ghost" size="sm" title="Ver Detalles">
                <EyeIcon size={18} />
              </Button> */}
            </Link>
              {/* Edit button was removed from list item, usually on detail page or modal */}
               <Button variant="ghost" size="sm" onClick={() => onEdit(local)} title="Editar Local"><EditIcon size={18}/></Button> 
               <Button variant="ghost" size="sm" onClick={() => onDelete(local.idlocation)} className="text-red-500 hover:text-red-700" title="Eliminar Local">
                <TrashIcon size={18} />
              </Button> 
          </div>
      </td>
    </tr>
  );
};

export default LocationListItem;
