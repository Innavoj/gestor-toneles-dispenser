
import React, { useState, useMemo } from 'react';
import { Tonel, TonelStatus, TonelLocation, SelectOption } from '../../types';
import TonelListItem from './TonelListItem';
import { TONEL_STATUS_OPTIONS, DEFAULT_TONEL_LOCATIONS, ITEMS_PER_PAGE } from '../../constants';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { ChevronUpIcon, ChevronDownIcon } from '../ui/Icon';
import Button from '../ui/Button';

interface TonelListProps {
  toneles: Tonel[];
  onDeleteTonel: (idtonel: string) => void;
  onUpdateTonelStatus: (tonel: Tonel) => void;
  onScheduleMaintenance: (tonel: Tonel) => void;
}

type SortableTonelFields = 'nserial' | 'capacity' | 'status' | 'location' | 'acquired';

const TonelList: React.FC<TonelListProps> = ({ toneles, onDeleteTonel, onUpdateTonelStatus, onScheduleMaintenance }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TonelStatus | ''>('');
  const [locationFilter, setLocationFilter] = useState<TonelLocation | ''>('');
  const [sortConfig, setSortConfig] = useState<{ key: SortableTonelFields; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const statusOptions: SelectOption[] = useMemo(() => 
    [{value: '', label: 'Todos los Estados'}, ...TONEL_STATUS_OPTIONS]
  , []);

  const locationOptions: SelectOption[] = useMemo(() =>
    [{ value: '', label: 'Todas las Ubicaciones'}, ...DEFAULT_TONEL_LOCATIONS]
  , []);


  const filteredToneles = useMemo(() => {
    let filtered = toneles.filter(tonel => {
      const matchesSearch = searchTerm === '' || 
        tonel.idtonel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tonel.nserial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tonel.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === '' || tonel.status === statusFilter;
      const matchesLocation = locationFilter === '' || tonel.location === locationFilter;
      return matchesSearch && matchesStatus && matchesLocation;
    });

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        let comparison = 0;
        if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB);
        } else if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        }
        // Add more type comparisons if needed (e.g., dates)
        
        return sortConfig.direction === 'descending' ? comparison * -1 : comparison;
      });
    }
    return filtered;
  }, [toneles, searchTerm, statusFilter, locationFilter, sortConfig]);

  const totalPages = Math.ceil(filteredToneles.length / ITEMS_PER_PAGE);
  const paginatedToneles = useMemo(() => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      return filteredToneles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredToneles, currentPage]);


  const requestSort = (key: SortableTonelFields) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page on sort
  };

  const getSortIcon = (key: SortableTonelFields) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronDownIcon size={14} className="opacity-30" />;
    }
    return sortConfig.direction === 'ascending' ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />;
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
  };


  if (toneles.length === 0 && !searchTerm && !statusFilter && !locationFilter) { // Check if initial list is empty
    return <p className="text-center text-brew-brown-600 py-8">No hay toneles registrados. ¡Añada el primero para comenzar!</p>;
  }
  
  const TableHeader: React.FC<{children: React.ReactNode, sortKey?: SortableTonelFields, className?: string}> = ({ children, sortKey, className }) => (
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
          label="Buscar Toneles"
        />
        <Select
          label="Filtrar por Estado"
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => {setStatusFilter(e.target.value as TonelStatus | ''); setCurrentPage(1);}}
          containerClassName="mb-0"
        />
        <Select
          label="Filtrar por Ubicación"
          options={locationOptions}
          value={locationFilter}
          onChange={(e) => {setLocationFilter(e.target.value as TonelLocation | ''); setCurrentPage(1);}}
          containerClassName="mb-0"
        />
      </div>

      {paginatedToneles.length === 0 && (
         <p className="text-center text-brew-brown-600 py-8">No se encontraron toneles que coincidan con los filtros actuales.</p>
      )}

      {paginatedToneles.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-brew-brown-200 bg-white">
            <thead className="bg-brew-brown-100">
              <tr>
                <TableHeader sortKey="nserial">NSerie</TableHeader>
                <TableHeader sortKey="capacity">Capacidad</TableHeader>
                <TableHeader sortKey="status">Estado</TableHeader>
                <TableHeader sortKey="location">Ubicación</TableHeader>
                <TableHeader>Lote Actual</TableHeader> {/* This field might not be directly sortable if it's derived */}
                <TableHeader sortKey="acquired">Adquirido</TableHeader>
                <TableHeader className="w-40">Acciones</TableHeader>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brew-brown-200">
              {paginatedToneles.map((tonel) => (
                <TonelListItem 
                  key={tonel.idtonel} 
                  tonel={tonel} 
                  onDelete={onDeleteTonel} 
                  onUpdateStatus={onUpdateTonelStatus}
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
                Página {currentPage} de {totalPages} (Total: {filteredToneles.length} toneles)
            </span>
            <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} variant="outline" size="sm">
                Siguiente
            </Button>
        </div>
      )}
    </div>
  );
};

export default TonelList;
