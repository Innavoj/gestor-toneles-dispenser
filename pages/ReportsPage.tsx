import React, { useEffect, useState, useMemo } from 'react';
import { Tonel, TonelStatus, LoteProduccion, MttoTonel, Dispensador, MttoDispensador, TonelLocation, DispensadorStatus, DispensadorLocation as DispensadorLocationType } from '../types'; // Added DispensadorStatus and DispensadorLocationType
import { tonelService } from '../services/tonelService';
import { loteService } from '../services/loteService';
import { mttoTonelService } from '../services/mttoTonelService';
import { dispensadorService } from '../services/dispensadorService';
import { mttoDispensadorService } from '../services/mttoDispensadorService';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatDate } from '../utils';

const ReportsPage: React.FC = () => {
  const [toneles, setToneles] = useState<Tonel[]>([]);
  const [lotes, setLotes] = useState<LoteProduccion[]>([]);
  const [mttoToneles, setMttoToneles] = useState<MttoTonel[]>([]);
  const [dispensadores, setDispensadores] = useState<Dispensador[]>([]);
  const [mttoDispensadores, setMttoDispensadores] = useState<MttoDispensador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
            tonelesData, 
            lotesData, 
            mttoTonelesData,
            dispensadoresData,
            mttoDispensadoresData
        ] = await Promise.all([
          tonelService.getAllToneles(),
          loteService.getAllLotes(),
          mttoTonelService.getAllMttoToneles(),
          dispensadorService.getAllDispensadores(),
          mttoDispensadorService.getAllMttoDispensadores()
        ]);
        setToneles(tonelesData);
        setLotes(lotesData);
        setMttoToneles(mttoTonelesData);
        setDispensadores(dispensadoresData);
        setMttoDispensadores(mttoDispensadoresData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al obtener datos para reportes.");
        console.error("Error al obtener datos para reportes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tonelAvailabilityReport = useMemo(() => {
    const report: Record<string, { count: number, locations: Record<string, number> }> = {};
    Object.values(TonelStatus).forEach(status => {
      report[status] = { count: 0, locations: {} };
    });

    toneles.forEach(tonel => {
      report[tonel.status].count++;
      report[tonel.status].locations[tonel.location] = (report[tonel.status].locations[tonel.location] || 0) + 1;
    });
    return report;
  }, [toneles]);

  const lotePorTonelReport = useMemo(() => {
    // This report is simpler now: each lote belongs to one tonel.
    // We can list lotes and show their associated tonel.
    return lotes.map(lote => {
      const tonelAsociado = toneles.find(t => t.idtonel === lote.idtonel);
      return {
        ...lote,
        nserialTonel: tonelAsociado?.nserial || 'N/A'
      };
    });
  }, [lotes, toneles]);

  const mttoTonelHistoryReport = useMemo(() => {
    return mttoToneles.sort((a,b) => new Date(b.fechaini).getTime() - new Date(a.fechaini).getTime());
  }, [mttoToneles]);

  const dispensadorReport = useMemo(() => {
    const report: Record<DispensadorStatus, { count: number, locations: Record<DispensadorLocationType, number>}> = 
      {} as Record<DispensadorStatus, { count: number, locations: Record<DispensadorLocationType, number>}>; // Type assertion for initial empty object

    Object.values(DispensadorStatus).forEach(status => {
        report[status] = { count: 0, locations: {} as Record<DispensadorLocationType, number> };
    });
    dispensadores.forEach(d => {
        report[d.status].count++;
        // Ensure d.location is treated as DispensadorLocationType for indexing
        const locKey = d.location as DispensadorLocationType;
        report[d.status].locations[locKey] = (report[d.status].locations[locKey] || 0) + 1;
    });
    return report;
  }, [dispensadores]);

  const mttoDispensadorHistoryReport = useMemo(() => {
    return mttoDispensadores.sort((a,b) => new Date(b.fechaini).getTime() - new Date(a.fechaini).getTime());
  }, [mttoDispensadores]);


  if (loading) {
    return <div className="flex justify-center items-center h-full"><LoadingSpinner message="Generando reportes..." /></div>;
  }
  if (error) {
    return <div className="text-center py-10 text-red-600">Error al generar reportes: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl py-6 font-bold text-brew-brown-700">Reportes</h2>

      <Card title="Reporte de Disponibilidad de Toneles">
        {Object.entries(tonelAvailabilityReport).map(([status, data]) => {
          if (data.count === 0 && toneles.length > 0) return null; // Only show if count > 0 or no toneles at all
          return (
            <div key={status} className="mb-4 p-3 bg-brew-brown-50 rounded border border-brew-brown-200">
              <h4 className="font-semibold text-brew-brown-700">{status.charAt(0).toUpperCase() + status.slice(1)}: {data.count} toneles</h4>
              {Object.keys(data.locations).length > 0 && (
                <ul className="list-disc list-inside ml-4 mt-1 text-sm text-brew-brown-600">
                  {Object.entries(data.locations).map(([loc, count]) => (
                    <li key={loc}>{loc}: {count}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
         {toneles.length === 0 && <p className="text-brew-brown-500">No hay datos de toneles para este reporte.</p>}
      </Card>

      <Card title="Reporte de Lotes de Producción y Tonel Asociado">
        {lotePorTonelReport.length === 0 && <p className="text-brew-brown-500">No hay lotes de producción.</p>}
        <div className="max-h-96 overflow-y-auto">
            <ul className="divide-y divide-brew-brown-100">
            {lotePorTonelReport.map(lote => (
            <li key={lote.idlote} className="py-3 px-1 hover:bg-brew-brown-50 rounded">
                <p className="font-medium text-brew-brown-700">
                {lote.lotename} ({lote.style}) - Tonel: {lote.nserialTonel}
                </p>
                <p className="text-sm text-brew-brown-600">
                Vol: {lote.volumen}L | Estado: {lote.status} | F.Prod: {formatDate(lote.entprod)}
                {lote.salprod && ` | F.Sal: ${formatDate(lote.salprod)}`}
                </p>
            </li>
            ))}
            </ul>
        </div>
      </Card>

      <Card title="Historial Completo de Mantenimiento de Toneles (Recientes Primero)">
        {mttoTonelHistoryReport.length === 0 && <p className="text-brew-brown-500">No hay tareas de mantenimiento de toneles registradas.</p>}
        <div className="max-h-96 overflow-y-auto">
            <ul className="divide-y divide-brew-brown-100">
            {mttoTonelHistoryReport.map(task => {
                const tonel = toneles.find(t => t.idtonel === task.idtonel);
                return (
                <li key={task.idmtto} className="py-3 px-1 hover:bg-brew-brown-50 rounded">
                    <p className="font-medium text-brew-brown-700">
                    {task.tipomtto} para Tonel: {tonel?.nserial || task.idtonel.substring(0,8)}
                    </p>
                    <p className="text-sm text-brew-brown-600">
                    F. Inicio: {formatDate(task.fechaini)} | Estado: {task.status}
                    {task.fechafin && ` | F. Fin: ${formatDate(task.fechafin)}`}
                    </p>
                </li>
                );
            })}
            </ul>
        </div>
      </Card>

      <Card title="Reporte de Estado de Dispensadores">
        {(Object.entries(dispensadorReport) as [DispensadorStatus, { count: number; locations: Record<DispensadorLocationType, number>; }][]).map(([status, data]) => {
          if (data.count === 0 && dispensadores.length > 0) return null;
          return (
            <div key={status} className="mb-4 p-3 bg-brew-brown-50 rounded border border-brew-brown-200">
              <h4 className="font-semibold text-brew-brown-700">{status.charAt(0).toUpperCase() + status.slice(1)}: {data.count} dispensadores</h4>
               {Object.keys(data.locations).length > 0 && (
                <ul className="list-disc list-inside ml-4 mt-1 text-sm text-brew-brown-600">
                  {(Object.entries(data.locations) as [DispensadorLocationType, number][]).map(([loc, count]) => (
                    <li key={loc}>{loc}: {count}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
        {dispensadores.length === 0 && <p className="text-brew-brown-500">No hay datos de dispensadores para este reporte.</p>}
      </Card>

      <Card title="Historial Completo de Mantenimiento de Dispensadores (Recientes Primero)">
        {mttoDispensadorHistoryReport.length === 0 && <p className="text-brew-brown-500">No hay tareas de mantenimiento de dispensadores registradas.</p>}
        <div className="max-h-96 overflow-y-auto">
            <ul className="divide-y divide-brew-brown-100">
            {mttoDispensadorHistoryReport.map(task => {
                const dispensador = dispensadores.find(d => d.iddispensador === task.iddispensador);
                return (
                <li key={task.idmtto} className="py-3 px-1 hover:bg-brew-brown-50 rounded">
                    <p className="font-medium text-brew-brown-700">
                    {task.tipomtto} para Dispensador: {dispensador?.nserial || task.iddispensador.substring(0,8)}
                    </p>
                    <p className="text-sm text-brew-brown-600">
                    F. Inicio: {formatDate(task.fechaini)} | Estado: {task.status}
                    {task.fechafin && ` | F. Fin: ${formatDate(task.fechafin)}`}
                    </p>
                </li>
                );
            })}
            </ul>
        </div>
      </Card>

    </div>
  );
};

export default ReportsPage;
