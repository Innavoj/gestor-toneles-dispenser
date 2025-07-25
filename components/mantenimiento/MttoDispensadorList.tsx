
import React from 'react';
import { MttoDispensador, MttoTaskStatus, Dispensador } from '../../types';
import { formatDate } from '../../utils';
import Button from '../ui/Button';
import { EditIcon, TrashIcon } from '../ui/Icon';

interface MttoDispensadorListProps {
  tasks: MttoDispensador[];
  dispensadores: Dispensador[]; 
  onEditTask: (task: MttoDispensador) => void;
  onDeleteTask: (idmtto: string) => void;
}

const getStatusColor = (status: MttoTaskStatus): string => {
   switch (status) {
    case MttoTaskStatus.PROGRAMADO: return 'bg-blue-100 text-blue-700';
    case MttoTaskStatus.EN_PROCESO: return 'bg-yellow-100 text-yellow-700';
    case MttoTaskStatus.COMPLETADO: return 'bg-green-100 text-green-700';
    case MttoTaskStatus.CANCELADO: return 'bg-gray-200 text-gray-600';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const MttoDispensadorList: React.FC<MttoDispensadorListProps> = ({ tasks, dispensadores, onEditTask, onDeleteTask }) => {
  
  const getDispensadorNSerial = (iddispensador: string): string => {
    const dispensador = dispensadores.find(d => d.iddispensador === iddispensador);
    return dispensador ? dispensador.nserial : iddispensador.substring(0,8);
  };

  if (tasks.length === 0) {
    return <p className="text-center text-brew-brown-600 py-8">No hay tareas de mantenimiento de dispensadores.</p>;
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-brew-brown-200 bg-white">
        <thead className="bg-brew-brown-100">
          <tr>
            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-brew-brown-500 uppercase tracking-wider">NSerial Dispensador</th>
            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-brew-brown-500 uppercase tracking-wider">Tipo de Tarea</th>
            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-brew-brown-500 uppercase tracking-wider">Fecha Inicio</th>
            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-brew-brown-500 uppercase tracking-wider">Estado</th>
            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-brew-brown-500 uppercase tracking-wider">Fecha Fin</th>
            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-brew-brown-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-brew-brown-200">
          {tasks.map((task) => (
            <tr key={task.idmtto} className="hover:bg-brew-brown-100/50 transition-colors">
              <td className="px-5 py-3 text-sm text-brew-brown-700 font-medium">{getDispensadorNSerial(task.iddispensador)}</td>
              <td className="px-5 py-3 text-sm text-brew-brown-700">{task.tipomtto}</td>
              <td className="px-5 py-3 text-sm text-brew-brown-700">{formatDate(task.fechaini)}</td>
              <td className="px-5 py-3 text-sm text-brew-brown-700">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </td>
              <td className="px-5 py-3 text-sm text-brew-brown-700">{task.fechafin ? formatDate(task.fechafin) : 'N/A'}</td>
              <td className="px-5 py-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEditTask(task)} title="Editar Tarea">
                    <EditIcon size={18} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDeleteTask(task.idmtto)} className="text-red-500 hover:text-red-700" title="Eliminar Tarea">
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

export default MttoDispensadorList;
