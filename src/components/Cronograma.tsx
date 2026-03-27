import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import './Cronograma.css';

interface CronogramaItem {
  id: string;
  zonificacion: string;
  codigoRecinto: string;
  familia: string;
  tipoEquipo: string;
  nombre: string;
  proveedor: string;
  cantidad: number;
  piso: number | null;
  recinto: string;
  entregaRecinto: string | null;
  inicioInstalacion: string | null;
  diasInstalacion: number;
  terminoInstalacion: string | null;
  servicioClinico: string;
}

type SortKey = keyof CronogramaItem;
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 50;

function getEstado(inicio: string | null, termino: string | null): 'completado' | 'en_progreso' | 'pendiente' {
  const hoy = new Date().toISOString().split('T')[0];
  if (!inicio || !termino) return 'pendiente';
  if (termino < hoy) return 'completado';
  if (inicio <= hoy) return 'en_progreso';
  return 'pendiente';
}

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
function formatDate(d: string | null): string {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${parseInt(day, 10)} ${MESES[parseInt(m, 10) - 1]} ${y}`;
}

export const Cronograma: React.FC = () => {
  const [data, setData] = useState<CronogramaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterProveedor, setFilterProveedor] = useState('');
  const [filterFamilia, setFilterFamilia] = useState('');
  const [filterPiso, setFilterPiso] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const base = import.meta.env.BASE_URL || '/';
    fetch(`${base}cronograma-data.json`)
      .then(r => r.json())
      .then((d: CronogramaItem[]) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const proveedores = useMemo(() => [...new Set(data.map(d => d.proveedor))].filter(Boolean).sort(), [data]);
  const familias = useMemo(() => [...new Set(data.map(d => d.familia))].filter(Boolean).sort(), [data]);
  const pisos = useMemo(() => [...new Set(data.map(d => d.piso))].filter(v => v !== null).sort((a, b) => (a as number) - (b as number)), [data]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return data.filter(item => {
      if (filterProveedor && item.proveedor !== filterProveedor) return false;
      if (filterFamilia && item.familia !== filterFamilia) return false;
      if (filterPiso && String(item.piso) !== filterPiso) return false;
      if (filterEstado && getEstado(item.inicioInstalacion, item.terminoInstalacion) !== filterEstado) return false;
      if (term) {
        return (
          item.id.toLowerCase().includes(term) ||
          item.nombre.toLowerCase().includes(term) ||
          item.recinto.toLowerCase().includes(term) ||
          item.servicioClinico.toLowerCase().includes(term) ||
          item.proveedor.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [data, search, filterProveedor, filterFamilia, filterPiso, filterEstado]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const clearFilters = () => {
    setSearch(''); setFilterProveedor(''); setFilterFamilia('');
    setFilterPiso(''); setFilterEstado(''); setPage(1);
  };

  const hasFilters = search || filterProveedor || filterFamilia || filterPiso || filterEstado;

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span className="sort-icon sort-none">↕</span>;
    return sortDir === 'asc'
      ? <ChevronUp size={13} className="sort-icon sort-active" />
      : <ChevronDown size={13} className="sort-icon sort-active" />;
  };

  // Resumen KPIs
  const totalItems = data.length;
  const totalCantidad = data.reduce((s, d) => s + d.cantidad, 0);
  const estados = useMemo(() => {
    const counts = { completado: 0, en_progreso: 0, pendiente: 0 };
    data.forEach(d => counts[getEstado(d.inicioInstalacion, d.terminoInstalacion)]++);
    return counts;
  }, [data]);

  if (loading) return <div className="cronograma-loading">Cargando cronograma...</div>;

  return (
    <div className="cronograma">
      {/* KPIs */}
      <div className="cronograma-kpis">
        <div className="kpi-card">
          <span className="kpi-value">{totalItems.toLocaleString('es-CL')}</span>
          <span className="kpi-label">Ítems totales</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-value">{totalCantidad.toLocaleString('es-CL')}</span>
          <span className="kpi-label">Unidades totales</span>
        </div>
        <div className="kpi-card kpi-pendiente">
          <span className="kpi-value">{estados.pendiente.toLocaleString('es-CL')}</span>
          <span className="kpi-label">Pendientes</span>
        </div>
        <div className="kpi-card kpi-progreso">
          <span className="kpi-value">{estados.en_progreso.toLocaleString('es-CL')}</span>
          <span className="kpi-label">En progreso</span>
        </div>
        <div className="kpi-card kpi-completado">
          <span className="kpi-value">{estados.completado.toLocaleString('es-CL')}</span>
          <span className="kpi-label">Completados</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="cronograma-filters">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar ítem, nombre, recinto..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="search-input"
          />
          {search && <button onClick={() => { setSearch(''); setPage(1); }} className="clear-btn"><X size={14} /></button>}
        </div>
        <select value={filterProveedor} onChange={e => { setFilterProveedor(e.target.value); setPage(1); }} className="filter-select">
          <option value="">Todos los proveedores</option>
          {proveedores.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={filterFamilia} onChange={e => { setFilterFamilia(e.target.value); setPage(1); }} className="filter-select">
          <option value="">Todas las familias</option>
          {familias.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select value={filterPiso} onChange={e => { setFilterPiso(e.target.value); setPage(1); }} className="filter-select">
          <option value="">Todos los pisos</option>
          {pisos.map(p => <option key={String(p)} value={String(p)}>Piso {p}</option>)}
        </select>
        <select value={filterEstado} onChange={e => { setFilterEstado(e.target.value); setPage(1); }} className="filter-select">
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_progreso">En progreso</option>
          <option value="completado">Completado</option>
        </select>
        {hasFilters && (
          <button onClick={clearFilters} className="clear-filters-btn">
            <X size={14} /> Limpiar filtros
          </button>
        )}
      </div>

      {/* Resultados info */}
      <div className="cronograma-info">
        Mostrando {paginated.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, sorted.length)} de {sorted.length.toLocaleString('es-CL')} resultados
      </div>

      {/* Tabla */}
      <div className="cronograma-table-wrap">
        <table className="cronograma-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>Ítem <SortIcon col="id" /></th>
              <th onClick={() => handleSort('nombre')}>Nombre <SortIcon col="nombre" /></th>
              <th onClick={() => handleSort('familia')}>Familia <SortIcon col="familia" /></th>
              <th onClick={() => handleSort('proveedor')}>Proveedor <SortIcon col="proveedor" /></th>
              <th onClick={() => handleSort('cantidad')}>Cant. <SortIcon col="cantidad" /></th>
              <th onClick={() => handleSort('piso')}>Piso <SortIcon col="piso" /></th>
              <th onClick={() => handleSort('recinto')}>Recinto <SortIcon col="recinto" /></th>
              <th onClick={() => handleSort('inicioInstalacion')}>Inicio <SortIcon col="inicioInstalacion" /></th>
              <th onClick={() => handleSort('terminoInstalacion')}>Término <SortIcon col="terminoInstalacion" /></th>
              <th onClick={() => handleSort('diasInstalacion')}>Días <SortIcon col="diasInstalacion" /></th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={11} className="no-results">Sin resultados</td></tr>
            ) : paginated.map(item => {
              const estado = getEstado(item.inicioInstalacion, item.terminoInstalacion);
              return (
                <tr key={item.id}>
                  <td className="col-id">{item.id}</td>
                  <td className="col-nombre" title={item.nombre}>{item.nombre}</td>
                  <td><span className={`badge badge-familia badge-${item.familia.toLowerCase()}`}>{item.familia}</span></td>
                  <td className="col-proveedor">{item.proveedor}</td>
                  <td className="col-num">{item.cantidad}</td>
                  <td className="col-num">{item.piso ?? '—'}</td>
                  <td className="col-recinto" title={item.recinto}>{item.recinto}</td>
                  <td className="col-fecha">{formatDate(item.inicioInstalacion)}</td>
                  <td className="col-fecha">{formatDate(item.terminoInstalacion)}</td>
                  <td className="col-num">{item.diasInstalacion || '—'}</td>
                  <td>
                    <span className={`badge badge-estado badge-${estado}`}>
                      {estado === 'completado' ? 'Completado' : estado === 'en_progreso' ? 'En progreso' : 'Pendiente'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="cronograma-pagination">
          <button onClick={() => setPage(1)} disabled={page === 1}>«</button>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
          <span>Página {page} de {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
        </div>
      )}
    </div>
  );
};
