import type { RawItem, SummaryData } from "../../types";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatError {
  error: boolean;
  message: string;
  code?: string;
  suggestion?: string;
}

/* ──────────────────────────────────────────────
   Motor de consultas local — sin backend
   Analiza RAW + SUMMARY directamente en el navegador
   ────────────────────────────────────────────── */

type QueryResult = string;

// Helpers
const fmt = (n: number) => n.toLocaleString("es-CL");
const pct = (n: number, total: number) => ((n / total) * 100).toFixed(1);
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const table = (headers: string[], rows: (string | number)[][]) => {
  const h = headers.join(" | ");
  const sep = headers.map(() => "---").join(" | ");
  const body = rows.map((r) => r.join(" | ")).join("\n");
  return `${h}\n${sep}\n${body}`;
};

// ── Intent detection ──
interface Intent {
  type: string;
  entity?: string;
  filters?: { piso?: number; servicio?: string; familia?: string; proveedor?: string; nombre?: string };
}

function detectIntent(q: string, data: RawItem[], summary: SummaryData): Intent {
  const n = normalize(q);

  // Detect floor filter
  let piso: number | undefined;
  const pisoMatch = n.match(/piso\s*(\d)/);
  if (pisoMatch) piso = parseInt(pisoMatch[1]);

  // Detect proveedor filter
  let proveedor: string | undefined;
  for (const p of summary.byProveedor) {
    if (n.includes(normalize(p.name))) { proveedor = p.name; break; }
  }

  // Detect familia filter
  let familia: string | undefined;
  const familiaMap: Record<string, string> = {
    silla: "Silla", sillas: "Silla", mesa: "Mesa", mesas: "Mesa",
    mobiliario: "Mobiliario", otro: "Otro", otros: "Otro",
  };
  for (const [kw, fam] of Object.entries(familiaMap)) {
    if (n.includes(kw)) { familia = fam; break; }
  }

  // Detect servicio filter
  let servicio: string | undefined;
  for (const s of summary.byServicio) {
    if (n.includes(normalize(s.name))) { servicio = s.name; break; }
  }

  // Detect specific nombre
  let nombre: string | undefined;
  for (const item of summary.byNombre) {
    if (n.includes(normalize(item.name))) { nombre = item.name; break; }
  }

  const filters = { piso, proveedor, familia, servicio, nombre };

  // Intent classification
  if (/resumen|resume|general|todo|inventario completo|overview|estadistica/.test(n))
    return { type: "resumen", filters };
  if (/cuant[oa]s?\s+(hay|tiene|son|existen|unidades)/.test(n) || /total\s+de/.test(n) || /numero\s+de/.test(n))
    return { type: "contar", filters };
  if (/distribu|reparto|repartid|desglos/.test(n) && (piso !== undefined || /piso/.test(n)))
    return { type: "distribucion_pisos", filters };
  if (/distribu|reparto|repartid|desglos/.test(n) && servicio)
    return { type: "distribucion_servicios", filters };
  if (/piso/.test(n) && !piso && /compar|todos|cada/.test(n))
    return { type: "comparar_pisos", filters };
  if (/proveedor/.test(n))
    return { type: "proveedores", filters };
  if (/servicio/.test(n) && /mas|mayor|principal|top/.test(n))
    return { type: "top_servicios", filters };
  if (/servicio/.test(n))
    return { type: "servicios", filters };
  if (/familia/.test(n) || /tipo.*mueble/.test(n) || /categori/.test(n))
    return { type: "familias", filters };
  if (/fecha|instalacion|cuando|calendario|cronograma|mes|semana/.test(n))
    return { type: "fechas", filters };
  if (/zona/.test(n))
    return { type: "zonas", filters };
  if (/recinto/.test(n))
    return { type: "recintos", filters };
  if (/nombre|producto|articulo|item/.test(n))
    return { type: "productos", filters };
  if (piso !== undefined) return { type: "piso_detalle", filters };
  if (proveedor) return { type: "proveedor_detalle", filters };
  if (servicio) return { type: "servicio_detalle", filters };
  if (familia) return { type: "contar", filters };
  if (nombre) return { type: "producto_detalle", filters };

  // Greeting / help
  if (/hola|buenos|buenas|hey|saludos/.test(n)) return { type: "saludo" };
  if (/ayuda|help|que puedes|como funciona/.test(n)) return { type: "ayuda" };

  return { type: "general", filters };
}

// ── Response generators ──
function processQuery(q: string, data: RawItem[], summary: SummaryData): QueryResult {
  const intent = detectIntent(q, data, summary);
  const f = intent.filters || {};

  // Apply filters to raw data
  const applyFilters = (items: RawItem[]): RawItem[] => {
    let filtered = items;
    if (f.piso !== undefined) filtered = filtered.filter((i) => i.piso === f.piso);
    if (f.proveedor) filtered = filtered.filter((i) => i.proveedor === f.proveedor);
    if (f.familia) filtered = filtered.filter((i) => i.familia === f.familia);
    if (f.servicio) filtered = filtered.filter((i) => i.servicio === f.servicio);
    if (f.nombre) filtered = filtered.filter((i) => i.nombre === f.nombre);
    return filtered;
  };

  switch (intent.type) {
    case "saludo":
      return "¡Hola! 👋 Soy el asistente del inventario del Hospital Buin Paine. Puedo responder preguntas sobre:\n\n• Cantidades de muebles por tipo, piso, servicio o proveedor\n• Distribución del inventario\n• Estadísticas generales\n• Fechas de instalación\n\n¿En qué te puedo ayudar?";

    case "ayuda":
      return `Puedes preguntarme cosas como:\n\n• "¿Cuántas sillas hay en total?"\n• "¿Cuántos muebles tiene el piso 3?"\n• "Muestra la distribución por proveedor"\n• "¿Qué servicios tienen más muebles?"\n• "¿Cuántos escritorios hay en Urgencia?"\n• "Resumen general del inventario"\n• "¿Cuándo se instala todo?"\n\nPuedes combinar filtros: piso, servicio, familia, proveedor y producto.`;

    case "resumen": {
      const rows = summary.byFamilia.map((f) => [f.name, fmt(f.qty), pct(f.qty, summary.totalQty) + "%"]);
      return `📊 **Resumen General del Inventario**\n\n• **Total Artículos:** ${fmt(summary.totalItems)}\n• **Total Unidades:** ${fmt(summary.totalQty)}\n• **Recintos Únicos:** ${fmt(summary.uniqueRecintos)}\n• **Tipos de Mueble:** ${summary.uniqueNombres}\n• **Pisos:** ${summary.pisos}\n• **Servicios:** ${summary.uniqueServicios}\n• **Proveedores:** ${summary.proveedores}\n• **Familias:** ${summary.familias}\n\n**Por Familia:**\n${table(["Familia", "Unidades", "%"], rows)}\n\n**Por Proveedor:**\n${summary.byProveedor.map((p) => `• ${p.name}: ${fmt(p.qty)} (${pct(p.qty, summary.totalQty)}%)`).join("\n")}`;
    }

    case "contar": {
      const filtered = applyFilters(data);
      const totalQty = filtered.reduce((s, i) => s + i.cantidad, 0);
      const totalItems = filtered.length;

      const parts: string[] = [];
      if (f.familia) parts.push(`familia **${f.familia}**`);
      if (f.proveedor) parts.push(`proveedor **${f.proveedor}**`);
      if (f.piso !== undefined) parts.push(`**Piso ${f.piso}**`);
      if (f.servicio) parts.push(`servicio **${f.servicio}**`);
      if (f.nombre) parts.push(`producto **${f.nombre}**`);

      const context = parts.length > 0 ? ` (${parts.join(", ")})` : "";

      if (totalItems === 0) {
        return `No se encontraron resultados para los filtros especificados${context}.`;
      }

      // Add breakdown
      let breakdown = "";
      if (!f.familia && totalItems > 1) {
        const byFam: Record<string, number> = {};
        filtered.forEach((i) => { byFam[i.familia] = (byFam[i.familia] || 0) + i.cantidad; });
        const rows = Object.entries(byFam).sort(([, a], [, b]) => b - a).map(([k, v]) => [k, fmt(v), pct(v, totalQty) + "%"]);
        breakdown = `\n\n**Desglose por familia:**\n${table(["Familia", "Unidades", "%"], rows)}`;
      }

      return `${context ? `Para${context}:` : "En total:"}\n\n• **${fmt(totalItems)}** artículos distintos\n• **${fmt(totalQty)}** unidades${breakdown}`;
    }

    case "comparar_pisos":
    case "distribucion_pisos": {
      const rows = summary.byPiso.map((p) => [p.name, fmt(p.qty), pct(p.qty, summary.totalQty) + "%"]);
      return `📍 **Distribución por Piso:**\n\n${table(["Piso", "Unidades", "%"], rows)}\n\n**Total:** ${fmt(summary.totalQty)} unidades`;
    }

    case "piso_detalle": {
      const pisoData = applyFilters(data);
      const totalQty = pisoData.reduce((s, i) => s + i.cantidad, 0);
      if (pisoData.length === 0) return `No hay datos para el Piso ${f.piso}.`;

      // By servicio
      const byServ: Record<string, number> = {};
      pisoData.forEach((i) => { byServ[i.servicio] = (byServ[i.servicio] || 0) + i.cantidad; });
      const servRows = Object.entries(byServ).sort(([, a], [, b]) => b - a).slice(0, 10).map(([k, v]) => [k, fmt(v)]);

      // By familia
      const byFam: Record<string, number> = {};
      pisoData.forEach((i) => { byFam[i.familia] = (byFam[i.familia] || 0) + i.cantidad; });
      const famRows = Object.entries(byFam).sort(([, a], [, b]) => b - a).map(([k, v]) => [k, fmt(v)]);

      return `🏥 **Piso ${f.piso} — Detalle**\n\n• **${fmt(pisoData.length)}** artículos, **${fmt(totalQty)}** unidades\n\n**Por Familia:**\n${table(["Familia", "Unidades"], famRows)}\n\n**Top 10 Servicios:**\n${table(["Servicio", "Unidades"], servRows)}`;
    }

    case "proveedores": {
      const rows = summary.byProveedor.map((p) => [p.name, fmt(p.qty), pct(p.qty, summary.totalQty) + "%"]);
      return `🏭 **Proveedores:**\n\n${table(["Proveedor", "Unidades", "%"], rows)}`;
    }

    case "proveedor_detalle": {
      const filtered = applyFilters(data);
      const totalQty = filtered.reduce((s, i) => s + i.cantidad, 0);
      if (filtered.length === 0) return `No hay datos para el proveedor "${f.proveedor}".`;

      const byFam: Record<string, number> = {};
      filtered.forEach((i) => { byFam[i.familia] = (byFam[i.familia] || 0) + i.cantidad; });
      const famRows = Object.entries(byFam).sort(([, a], [, b]) => b - a).map(([k, v]) => [k, fmt(v)]);

      const byPiso: Record<string, number> = {};
      filtered.forEach((i) => { byPiso[`Piso ${i.piso}`] = (byPiso[`Piso ${i.piso}`] || 0) + i.cantidad; });
      const pisoRows = Object.entries(byPiso).sort().map(([k, v]) => [k, fmt(v)]);

      return `🏭 **Proveedor: ${f.proveedor}**\n\n• **${fmt(filtered.length)}** artículos, **${fmt(totalQty)}** unidades (${pct(totalQty, summary.totalQty)}% del total)\n\n**Por Familia:**\n${table(["Familia", "Unidades"], famRows)}\n\n**Por Piso:**\n${table(["Piso", "Unidades"], pisoRows)}`;
    }

    case "top_servicios":
    case "servicios": {
      const rows = summary.byServicio.slice(0, 15).map((s, i) => [String(i + 1), s.name, fmt(s.qty), pct(s.qty, summary.totalQty) + "%"]);
      return `🏥 **Top 15 Servicios:**\n\n${table(["#", "Servicio", "Unidades", "%"], rows)}\n\n*Total servicios: ${summary.uniqueServicios}*`;
    }

    case "servicio_detalle": {
      const filtered = applyFilters(data);
      const totalQty = filtered.reduce((s, i) => s + i.cantidad, 0);
      if (filtered.length === 0) return `No hay datos para el servicio "${f.servicio}".`;

      const byNombre: Record<string, number> = {};
      filtered.forEach((i) => { byNombre[i.nombre] = (byNombre[i.nombre] || 0) + i.cantidad; });
      const rows = Object.entries(byNombre).sort(([, a], [, b]) => b - a).slice(0, 10).map(([k, v]) => [k, fmt(v)]);

      return `🏥 **Servicio: ${f.servicio}**\n\n• **${fmt(filtered.length)}** artículos, **${fmt(totalQty)}** unidades\n\n**Productos principales:**\n${table(["Producto", "Unidades"], rows)}`;
    }

    case "distribucion_servicios":
    case "familias": {
      const rows = summary.byFamilia.map((f) => [f.name, fmt(f.qty), pct(f.qty, summary.totalQty) + "%"]);
      return `📦 **Familias de Muebles:**\n\n${table(["Familia", "Unidades", "%"], rows)}`;
    }

    case "productos": {
      const filtered = f.piso || f.servicio || f.proveedor || f.familia
        ? applyFilters(data)
        : data;

      const byNombre: Record<string, number> = {};
      filtered.forEach((i) => { byNombre[i.nombre] = (byNombre[i.nombre] || 0) + i.cantidad; });
      const rows = Object.entries(byNombre).sort(([, a], [, b]) => b - a).slice(0, 20).map(([k, v], i) => [String(i + 1), k, fmt(v)]);

      return `📋 **Top 20 Productos:**\n\n${table(["#", "Producto", "Unidades"], rows)}`;
    }

    case "producto_detalle": {
      const filtered = data.filter((i) => i.nombre === f.nombre);
      const totalQty = filtered.reduce((s, i) => s + i.cantidad, 0);

      const byPiso: Record<string, number> = {};
      filtered.forEach((i) => { byPiso[`Piso ${i.piso}`] = (byPiso[`Piso ${i.piso}`] || 0) + i.cantidad; });
      const pisoRows = Object.entries(byPiso).sort().map(([k, v]) => [k, fmt(v)]);

      const byServ: Record<string, number> = {};
      filtered.forEach((i) => { byServ[i.servicio] = (byServ[i.servicio] || 0) + i.cantidad; });
      const servRows = Object.entries(byServ).sort(([, a], [, b]) => b - a).slice(0, 10).map(([k, v]) => [k, fmt(v)]);

      return `📋 **Producto: ${f.nombre}**\n\n• **${fmt(totalQty)}** unidades en **${filtered.length}** artículos\n\n**Por Piso:**\n${table(["Piso", "Unidades"], pisoRows)}\n\n**Top Servicios:**\n${table(["Servicio", "Unidades"], servRows)}`;
    }

    case "fechas": {
      const mesRows = summary.byMes.map((m) => [m.name, fmt(m.qty), pct(m.qty, summary.totalQty) + "%"]);
      const diaRows = summary.byDia.map((d) => [d.name, fmt(d.qty)]);

      return `📅 **Calendario de Instalación**\n\n• **Período:** ${summary.fechaStats.fechaMin} — ${summary.fechaStats.fechaMax}\n• **Artículos con fecha:** ${fmt(summary.fechaStats.totalConFecha)}\n\n**Por Mes:**\n${table(["Mes", "Unidades", "%"], mesRows)}\n\n**Por Día de Instalación:**\n${table(["Fecha", "Unidades"], diaRows)}`;
    }

    case "zonas": {
      const rows = summary.byZona.slice(0, 15).map((z) => [z.name, fmt(z.qty), pct(z.qty, summary.totalQty) + "%"]);
      return `🗺️ **Top 15 Zonas:**\n\n${table(["Zona", "Unidades", "%"], rows)}`;
    }

    case "recintos": {
      const filtered = f.piso || f.servicio ? applyFilters(data) : data;
      const byRecinto: Record<string, number> = {};
      filtered.forEach((i) => { byRecinto[i.recinto] = (byRecinto[i.recinto] || 0) + i.cantidad; });
      const rows = Object.entries(byRecinto).sort(([, a], [, b]) => b - a).slice(0, 15).map(([k, v]) => [k, fmt(v)]);

      const ctx = f.piso ? ` del Piso ${f.piso}` : f.servicio ? ` de ${f.servicio}` : "";
      return `🏠 **Top 15 Recintos${ctx}:**\n\n${table(["Recinto", "Unidades"], rows)}\n\n*Total recintos únicos: ${summary.uniqueRecintos}*`;
    }

    case "general":
    default: {
      // Try fuzzy match on any data
      const nq = normalize(q);
      const filtered = data.filter(
        (i) =>
          normalize(i.nombre).includes(nq) ||
          normalize(i.servicio).includes(nq) ||
          normalize(i.recinto).includes(nq) ||
          normalize(i.zona).includes(nq)
      );

      if (filtered.length > 0) {
        const totalQty = filtered.reduce((s, i) => s + i.cantidad, 0);
        const byNombre: Record<string, number> = {};
        filtered.forEach((i) => { byNombre[i.nombre] = (byNombre[i.nombre] || 0) + i.cantidad; });
        const rows = Object.entries(byNombre).sort(([, a], [, b]) => b - a).slice(0, 10).map(([k, v]) => [k, fmt(v)]);

        return `Encontré **${fmt(filtered.length)}** artículos (**${fmt(totalQty)}** unidades) relacionados con "${q}":\n\n${table(["Producto", "Unidades"], rows)}`;
      }

      return `No encontré resultados específicos para "${q}".\n\nPuedo ayudarte con:\n• Estadísticas generales ("resumen del inventario")\n• Consultas por piso ("¿qué hay en el piso 3?")\n• Por servicio ("muebles en Urgencia")\n• Por familia ("¿cuántas sillas hay?")\n• Por proveedor ("productos de MELMAN")\n• Fechas ("¿cuándo se instalan?")\n\n¿Qué te gustaría consultar?`;
    }
  }
}

// ── Public API (same interface as before, but 100% client-side) ──
class ChatServiceClass {
  private data: RawItem[] = [];
  private summary: SummaryData | null = null;

  setData(data: RawItem[], summary: SummaryData) {
    this.data = data;
    this.summary = summary;
  }

  async sendMessage(
    message: string,
    _sessionId?: string,
    _conversationHistory?: Message[]
  ): Promise<{ response: { id: string; response: string; sessionId: string; tokensUsed: number; model: string; timestamp: string }; error: null } | { response: null; error: ChatError }> {
    if (!this.summary || this.data.length === 0) {
      return {
        response: null,
        error: { error: true, message: "Datos del inventario no cargados", code: "NO_DATA" },
      };
    }

    try {
      // Small delay for UX feel
      await new Promise((r) => setTimeout(r, 300));

      const answer = processQuery(message, this.data, this.summary);
      return {
        response: {
          id: Math.random().toString(36).substr(2, 9),
          response: answer,
          sessionId: "local",
          tokensUsed: 0,
          model: "local-engine",
          timestamp: new Date().toISOString(),
        },
        error: null,
      };
    } catch (err) {
      return {
        response: null,
        error: { error: true, message: "Error al procesar la consulta", code: "PROCESSING_ERROR" },
      };
    }
  }

  async checkHealth(): Promise<boolean> {
    return true; // Always available — runs locally
  }
}

export const ChatService = new ChatServiceClass();
