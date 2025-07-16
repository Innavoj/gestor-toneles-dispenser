
import React, { useState, useMemo, useEffect } from 'react';
import { Dispensador, DispensadorStatus, SelectOption } from '../../types';
import DispensadorListItem from './DispensadorListItem';
import { DISPENSADOR_STATUS_OPTIONS, ITEMS_PER_PAGE } from '../../constants';
import { locationService } from '../../services/locationService';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { ChevronUpIcon, ChevronDownIcon } from '../ui/Icon';
import Button from '../ui/Button';

interface DispensadorListProps {
  dispensadores: Dispensador[];
  onEditDispensador: (dispensador: Dispensador) => void;
  onDeleteDispensador: (iddispensador: string) => void;
  onScheduleMaintenance: (dispensador: Dispensador) => void;
}

type SortableDispensadorFields = 'nserial' | 'status' | 'location' | 'acquired';

const DispensadorList: React.FC<DispensadorListProps> = ({ dispensadores, onEditDispensador, onDeleteDispensador, onScheduleMaintenance }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DispensadorStatus | ''>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [locationOptions, setLocationOptions] = useState<SelectOption[]>([{ value: '', label: 'Todas las Ubicaciones' }]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortableDispensadorFields; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const statusOptions: SelectOption[] = useMemo(() => 
    [{value: '', label: 'Todos los Estados'}, ...DISPENSADOR_STATUS_OPTIONS]
  , []);


  useEffect(() => {
    setLoadingLocations(true);
    locationService.getAllLocation()
      .then((locations) => {
        const opts = locations.map((loc) => ({ value: loc.location, label: loc.location }));
        setLocationOptions([{ value: '', label: 'Todas las Ubicaciones' }, ...opts]);
      })
      .catch(() => {
        setLocationOptions([{ value: '', label: 'Todas las Ubicaciones' }]);
      })
      .finally(() => setLoadingLocations(false));
  }, []);

  const filteredDispensadores = useMemo(() => {
    let filtered = dispensadores.filter(d => {
      const matchesSearch = searchTerm === '' || 
        d.nserial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === '' || d.status === statusFilter;
      const matchesLocation = locationFilter === '' || d.location === locationFilter;
      return matchesSearch && matchesStatus && matchesLocation;
    });

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        let comparison = 0;
        if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB);
        } // Add other type comparisons if needed
        return sortConfig.direction === 'descending' ? comparison * -1 : comparison;
      });
    }
    return filtered;
  }, [dispensadores, searchTerm, statusFilter, locationFilter, sortConfig]);

  const totalPages = Math.ceil(filteredDispensadores.length / ITEMS_PER_PAGE);
  const paginatedDispensadores = useMemo(() => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      return filteredDispensadores.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDispensadores, currentPage]);

  const requestSort = (key: SortableDispensadorFields) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getSortIcon = (key: SortableDispensadorFields) => {
    if (!sortConfig || sortConfig.key !== key) return <ChevronDownIcon size={14} className="opacity-30" />;
    return sortConfig.direction === 'ascending' ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />;
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  if (dispensadores.length === 0 && !searchTerm && !statusFilter && !locationFilter) {
    return <p className="text-center text-brew-brown-600 py-8">No hay dispensadores registrados. ¡Añada el primero!</p>;
  }
  
  const TableHeader: React.FC<{children: React.ReactNode, sortKey?: SortableDispensadorFields, className?: string}> = ({ children, sortKey, className }) => (
    <th 
      scope="col" 
      className={`px-5 py-3 text-left text-xs font-medium text-brew-brown-500 uppercase tracking-wider ${sortKey ? 'cursor-pointer hover:bg-brew-brown-200' : ''} ${className}`}
      onClick={sortKey ? () => requestSort(sortKey) : undefined}
    >
      <div className="flex items-center">
        {children}
        {sortKey && <span className="ml-1">{getSortIcon(sortKey)}</span>}
      </div>
    </th>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white shadow rounded-lg border border-brew-brown-200">
        <Input
          placeholder="Buscar por NSerial, Ubicación..."
          value={searchTerm}
          onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
          containerClassName="mb-0"
          label="Buscar Dispensadores"
        />
        <Select
          label="Filtrar por Estado"
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => {setStatusFilter(e.target.value as DispensadorStatus | ''); setCurrentPage(1);}}
          containerClassName="mb-0"
        />
        <Select
          label="Filtrar por Ubicación"
          options={locationOptions}
          value={locationFilter}
          onChange={(e) => {setLocationFilter(e.target.value); setCurrentPage(1);}}
          containerClassName="mb-0"
          disabled={loadingLocations}
        />
      </div>

      {paginatedDispensadores.length === 0 && (
         <p className="text-center text-brew-brown-600 py-8">No se encontraron dispensadores que coincidan con los filtros.</p>
      )}

      {paginatedDispensadores.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-brew-brown-200 bg-white">
            <thead className="bg-brew-brown-100">
              <tr>
                <TableHeader sortKey="nserial">NSerie</TableHeader>
                <TableHeader sortKey="status">Estado</TableHeader>
                <TableHeader sortKey="location">Ubicación</TableHeader>
                <TableHeader sortKey="acquired">Adquirido</TableHeader>
                <TableHeader className="w-48">Acciones</TableHeader>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brew-brown-200">
              {paginatedDispensadores.map((d) => (
                <DispensadorListItem 
                  key={d.iddispensador} 
                  dispensador={d} 
                  onEdit={onEditDispensador}
                  onDelete={onDeleteDispensador} 
                  onScheduleMaintenance={onScheduleMaintenance}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4">
            <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} variant="outline" size="sm">
                Anterior
            </Button>
            <span className="text-sm text-brew-brown-700">
                Página {currentPage} de {totalPages} (Total: {filteredDispensadores.length} dispensadores)
            </span>
            <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} variant="outline" size="sm">
                Siguiente
            </Button>
        </div>
      )}
    </div>
  );
};

export default DispensadorList;
