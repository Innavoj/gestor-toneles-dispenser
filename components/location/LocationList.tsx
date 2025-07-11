import React, { useState, useMemo } from 'react';
import { Location,  } from '../../types';
//import TonelListItem from './LocationListItem';
import { TONEL_STATUS_OPTIONS, DEFAULT_TONEL_LOCATIONS, ITEMS_PER_PAGE } from '../../constants';
import Input from '../ui/Input';
//import Select from '../ui/Select';
import { ChevronUpIcon, ChevronDownIcon } from '../ui/Icon';
import Button from '../ui/Button';
import LocationListItem from './LocationListItem';

interface LocationListProps {
  location: Location[];
  onDeleteLocation: (idlocation: string) => void;
//  onUpdateTonelStatus: (tonel: Tonel) => void;
 // onScheduleMaintenance: (tonel: Tonel) => void;
}

type SortableLocationFields = 'location' ;

const LocationList: React.FC<LocationListProps> = ({ location, onDeleteLocation }) => {
  const [searchTerm, setSearchTerm] = useState('');
 // const [statusFilter, setStatusFilter] = useState<Location | ''>('');
  const [locationFilter, setLocationFilter] = useState<Location | ''>('');
  const [sortConfig, setSortConfig] = useState<{ key: SortableLocationFields; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // const statusOptions: SelectOption[] = useMemo(() => 
  //   [{value: '', label: 'Todos los Estados'}, ...TONEL_STATUS_OPTIONS]
  // , []);

  // const locationOptions: SelectOption[] = useMemo(() =>
  //   [{ value: '', label: 'Todas las Ubicaciones'}, ...DEFAULT_TONEL_LOCATIONS]
  // , []);


  const filteredLocation = useMemo(() => {
    let filtered = location.filter(local => {
      const matchesSearch = searchTerm === '' || 
        local.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        local.description.toLowerCase().includes(searchTerm.toLowerCase()) ;
      
    //  const matchesStatus = statusFilter === '' || local.location === statusFilter;
      const matchesLocation = locationFilter === '' || local.location === locationFilter.location;
      return matchesSearch &&  matchesLocation;
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
  }, [location,  searchTerm, locationFilter, sortConfig]);

  const totalPages = Math.ceil(filteredLocation.length / ITEMS_PER_PAGE);
  const paginatedLocation = useMemo(() => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      return filteredLocation.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLocation, currentPage]);


  const requestSort = (key: SortableLocationFields) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page on sort
  };

  const getSortIcon = (key: SortableLocationFields) => {
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


  if (location.length === 0 && !searchTerm && !locationFilter) { // Check if initial list is empty
    return <p className="text-center text-brew-brown-600 py-8">No hay locales registrados. ¡Añada el primero para comenzar!</p>;
  }
  
  const TableHeader: React.FC<{children: React.ReactNode, sortKey?: SortableLocationFields, className?: string}> = ({ children, sortKey, className }) => (
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
          placeholder="Buscar por Ubicación..."
          value={searchTerm}
          onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
          containerClassName="mb-0"
          label="Buscar locales"
        />
        
      </div>

      {paginatedLocation.length === 0 && (
         <p className="text-center text-brew-brown-600 py-8">No se encontraron locales que coincidan con los filtros actuales.</p>
      )}

      {paginatedLocation.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-brew-brown-200 bg-white">
            <thead className="bg-brew-brown-100">
              <tr>
                <TableHeader sortKey="location">Ubicacion</TableHeader><TableHeader>Descripcion</TableHeader>{/* This field might not be directly sortable if it's derived */}<TableHeader className="w-40">Acciones</TableHeader>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brew-brown-200">
              {paginatedLocation.map((local) => (
                <LocationListItem 
                  key={local.idlocation} 
                  local={local} 
                  onDelete={onDeleteLocation} 
               //   onUpdateStatus={onUpdateTonelStatus}
               //   onScheduleMaintenance={onScheduleMaintenance}
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
                Página {currentPage} de {totalPages} (Total: {filteredLocation.length} locales)
            </span>
            <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} variant="outline" size="sm">
                Siguiente
            </Button>
        </div>
      )}
    </div>
  );
};

export default LocationList;
