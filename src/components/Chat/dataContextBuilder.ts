// Types matching the dashboard
export interface RawItem {
  item: string;
  zona: string;
  servicio: string;
  familia: string;
  nombre: string;
  proveedor: string;
  cantidad: number;
  piso: number;
  recinto: string;
  fechaInstalacion: string;
}

export interface SummaryData {
  totalItems: number;
  totalUnits: number;
  uniqueRooms: number;
  furnitureTypes: number;
  floors: number;
  services: number;
  suppliers: number;
  byFamily?: Record<string, number>;
  bySupplier?: Record<string, number>;
  byFloor?: Record<string, number>;
  topServices?: { name: string; count: number }[];
}

/**
 * Prepare dashboard data for chat context injection
 * Converts raw items and summary into structured text for LLM context
 */
export function buildDataContext(rawItems: RawItem[], summary: SummaryData): string {
  // Group by family
  const familyMap: Record<string, number> = {};
  const supplierMap: Record<string, number> = {};
  const floorMap: Record<string, number> = {};
  const serviceMap: Record<string, number> = {};

  rawItems.forEach((item) => {
    familyMap[item.familia] = (familyMap[item.familia] || 0) + item.cantidad;
    supplierMap[item.proveedor] = (supplierMap[item.proveedor] || 0) + item.cantidad;
    floorMap[item.piso] = (floorMap[item.piso] || 0) + item.cantidad;
    serviceMap[item.servicio] = (serviceMap[item.servicio] || 0) + item.cantidad;
  });

  // Build formatted context
  const familyStats = Object.entries(familyMap)
    .sort(([, a], [, b]) => b - a)
    .map(([family, count]) => `- ${family}: ${count} unidades`)
    .join("\n");

  const supplierStats = Object.entries(supplierMap)
    .sort(([, a], [, b]) => b - a)
    .map(([supplier, count]) => `- ${supplier}: ${count} unidades`)
    .join("\n");

  const floorStats = Object.entries(floorMap)
    .sort()
    .map(([floor, count]) => `- Piso ${floor}: ${count} unidades`)
    .join("\n");

  const serviceStats = Object.entries(serviceMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([service, count]) => `- ${service}: ${count} unidades`)
    .join("\n");

  return `=== CONTEXTO DE INVENTARIO DEL HOSPITAL ===

Estadísticas Generales:
- Total de Artículos: ${summary.totalItems}
- Total de Unidades: ${summary.totalUnits}
- Recintos Únicos: ${summary.uniqueRooms}
- Tipos de Muebles: ${summary.furnitureTypes}
- Pisos: ${summary.floors} (del 1 al 7)
- Servicios: ${summary.services}
- Proveedores: ${summary.suppliers}

Equipamiento por Familia:
${familyStats}

Equipamiento por Proveedor:
${supplierStats}

Distribución por Piso:
${floorStats}

Servicios Principales (Top 10):
${serviceStats}

=== FIN CONTEXTO ===`;
}
