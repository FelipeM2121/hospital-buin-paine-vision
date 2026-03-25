import type { RawItem, SummaryData, EETTFile } from "../../types";

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

/* ═══════════════════════════════════════════════════════════════
   Chat Service — Ollama LLM (local) con contexto completo
   Conecta directamente a Ollama en localhost:11434
   ═══════════════════════════════════════════════════════════════ */

const OLLAMA_URL = "http://localhost:11434";
const MODEL = "mistral";

const fmt = (n: number) => n.toLocaleString("es-CL");

// ── Build the full data context for the LLM system prompt ──
function buildSystemPrompt(data: RawItem[], summary: SummaryData, eettFiles: EETTFile[]): string {
  // Group data
  const byFamilia: Record<string, number> = {};
  const byProveedor: Record<string, number> = {};
  const byPiso: Record<string, number> = {};
  const byServicio: Record<string, number> = {};
  const byNombre: Record<string, number> = {};

  data.forEach((i) => {
    byFamilia[i.familia] = (byFamilia[i.familia] || 0) + i.cantidad;
    byProveedor[i.proveedor] = (byProveedor[i.proveedor] || 0) + i.cantidad;
    byPiso[`Piso ${i.piso}`] = (byPiso[`Piso ${i.piso}`] || 0) + i.cantidad;
    byServicio[i.servicio] = (byServicio[i.servicio] || 0) + i.cantidad;
    byNombre[i.nombre] = (byNombre[i.nombre] || 0) + i.cantidad;
  });

  const sortDesc = (obj: Record<string, number>) =>
    Object.entries(obj).sort(([, a], [, b]) => b - a);

  const familiaStr = sortDesc(byFamilia).map(([k, v]) => `  ${k}: ${fmt(v)} uds`).join("\n");
  const provStr = sortDesc(byProveedor).map(([k, v]) => `  ${k}: ${fmt(v)} uds`).join("\n");
  const pisoStr = Object.entries(byPiso).sort().map(([k, v]) => `  ${k}: ${fmt(v)} uds`).join("\n");
  const servStr = sortDesc(byServicio).slice(0, 20).map(([k, v]) => `  ${k}: ${fmt(v)} uds`).join("\n");
  const prodStr = sortDesc(byNombre).slice(0, 25).map(([k, v]) => `  ${k}: ${fmt(v)} uds`).join("\n");

  // EETT specs
  const eettStr = eettFiles.map((e) => {
    const spec = EETT_KNOWLEDGE[e.code];
    if (spec) {
      return `  EETT ${e.code} - ${e.name}: ${spec.desc}. Material: ${spec.material}. Dimensiones: ${spec.dimensiones}. Color: ${spec.color}. PDF: ${e.file}`;
    }
    return `  EETT ${e.code} - ${e.name}. PDF: ${e.file}`;
  }).join("\n");

  // Dates
  const fechaStr = summary.byMes?.map((m) => `  ${m.name}: ${fmt(m.qty)} uds`).join("\n") || "  Sin datos de fechas";

  // Zonas
  const zonaStr = summary.byZona?.slice(0, 15).map((z) => `  ${z.name}: ${fmt(z.qty)} uds`).join("\n") || "";

  return `Eres el asistente IA del Sistema de Gestión Documental (SGD) del Hospital Buin Paine.
Respondes preguntas sobre el inventario de mobiliario no clínico del hospital.

INSTRUCCIONES:
- Responde SIEMPRE en español
- Sé conciso y profesional
- Usa datos específicos y cifras exactas de los datos proporcionados
- Cuando muestres tablas, usa formato markdown
- Si preguntan algo fuera del inventario, redirecciona amablemente
- Si preguntan por un producto específico, incluye la ficha técnica EETT si existe
- Los PDFs de fichas técnicas están en la ruta "eett/" seguido del nombre del archivo

═══ DATOS DEL INVENTARIO ═══

ESTADÍSTICAS GENERALES:
- Total artículos: ${fmt(summary.totalItems)}
- Total unidades: ${fmt(summary.totalQty)}
- Recintos únicos: ${fmt(summary.uniqueRecintos)}
- Tipos de mueble: ${summary.uniqueNombres}
- Pisos: ${summary.pisos} (del 1 al 7)
- Servicios: ${summary.uniqueServicios}
- Proveedores: ${summary.proveedores}
- Familias: ${summary.familias} (Silla, Mesa, Otro, Mobiliario)

POR FAMILIA:
${familiaStr}

POR PROVEEDOR:
${provStr}

POR PISO:
${pisoStr}

TOP 20 SERVICIOS:
${servStr}

TOP 25 PRODUCTOS:
${prodStr}

CALENDARIO DE INSTALACIÓN:
- Período: ${summary.fechaStats?.fechaMin || "04/05/2026"} a ${summary.fechaStats?.fechaMax || "03/08/2026"}
${fechaStr}

TOP ZONAS:
${zonaStr}

═══ FICHAS TÉCNICAS EETT (${eettFiles.length} especificaciones) ═══
${eettStr}

═══ CONTROL DOCUMENTAL ═══
Sistema de control documental en SharePoint. Estructura por código de item MNC.
Cada item tiene: ETAPA CONSTRUCCION y ETAPA EXPLOTACION, cada una con ADQUISICION > Antecedentes Ofertas (A, B, C por proveedor).
Carpetas A = ${summary.byProveedor?.[0]?.name || "Proveedor A"}, B = ${summary.byProveedor?.[1]?.name || "Proveedor B"}, C = ${summary.byProveedor?.[2]?.name || "Proveedor C"}

═══ SECCIONES DE LA PLATAFORMA ═══
- Resumen: KPIs generales del inventario
- Por Piso: Distribución en 7 pisos
- Por Servicio: Desglose en ${summary.uniqueServicios} servicios
- Por Producto: ${summary.uniqueNombres} tipos de mueble
- Por Fecha: Calendario de instalación
- Esp. Técnicas: ${eettFiles.length} fichas EETT con PDFs
- Control Documento: Repositorio SharePoint
- Chat IA: Este asistente

Fecha actual: ${new Date().toLocaleDateString("es-CL")}`;
}

// ── EETT knowledge base ──
const EETT_KNOWLEDGE: Record<string, { desc: string; material: string; dimensiones: string; color: string }> = {
  "201.001": { desc: "Estación de trabajo para oficinas administrativas", material: "Estructura metálica, cubierta melamina 25mm", dimensiones: "1600x700x750mm", color: "Cubierta haya/roble, estructura gris/negro" },
  "201.002": { desc: "Mesa lateral auxiliar hospitalaria", material: "Cubierta melamina, estructura metálica tubular", dimensiones: "450x450x550mm", color: "Cubierta haya, estructura gris" },
  "201.003": { desc: "Mesa párvulo inclusión, adaptada para silla de ruedas", material: "Cubierta melamina, estructura metálica", dimensiones: "800x600x560mm regulable", color: "Colores infantiles" },
  "201.004": { desc: "Mesa párvulo tipo I para sala cuna", material: "Cubierta melamina, patas madera/metal", dimensiones: "600x600x460mm", color: "Colores infantiles" },
  "201.005": { desc: "Mesa párvulo tipo II para actividades grupales", material: "Cubierta melamina, estructura metálica", dimensiones: "1200x600x460mm", color: "Colores infantiles" },
  "201.008": { desc: "Mesa reuniones tipo I, 6-8 personas", material: "Cubierta melamina 25mm, base metálica", dimensiones: "2000x1000x750mm", color: "Haya/roble, base cromada" },
  "201.009": { desc: "Mesa reuniones tipo II, 8-10 personas", material: "Cubierta melamina 25mm, base metálica", dimensiones: "2400x1200x750mm", color: "Haya/roble" },
  "201.010": { desc: "Mesa reuniones tipo III directiva, 10-14 personas", material: "Cubierta melamina 25mm o enchapada", dimensiones: "3000x1200x750mm", color: "Roble/nogal" },
  "201.011": { desc: "Mesa tipo casino rectangular para comedor", material: "Cubierta melamina HPL, estructura metálica", dimensiones: "1200x800x750mm", color: "Blanca, estructura gris" },
  "201.011B": { desc: "Mesa tipo casino circular Ø90cm", material: "Cubierta melamina HPL, base central metálica", dimensiones: "Ø900x750mm", color: "Blanca, base cromada" },
  "202.001": { desc: "Atril graduable para lectura/presentaciones", material: "Estructura metálica tubular", dimensiones: "Regulable 800-1200mm", color: "Negro/gris" },
  "202.006": { desc: "Cama apilable para sala cuna", material: "Estructura metálica, colchoneta espuma", dimensiones: "1300x550x250mm", color: "Colores variados" },
  "202.008": { desc: "Cuna alta hospitalaria para neonatología", material: "Estructura metálica, barandas transparentes", dimensiones: "900x500x900mm", color: "Blanco" },
  "202.009": { desc: "Cuna baja para sala cuna", material: "Madera MDF y metal", dimensiones: "1200x600x400mm", color: "Natural/blanco" },
  "202.012": { desc: "Mueble locker metálico para vestuario", material: "Acero laminado, pintura electrostática", dimensiones: "380x450x1800mm", color: "Gris/beige" },
  "203.014": { desc: "Librero estantería para oficinas", material: "Melamina 18mm", dimensiones: "800x350x1800mm", color: "Haya/roble/blanco" },
  "203.015": { desc: "Mueble arrimo bajo para apoyo", material: "Melamina 18mm", dimensiones: "1200x400x750mm", color: "Haya/roble" },
  "203.016": { desc: "Mueble tipo biblioteca grande", material: "Melamina 25mm reforzada", dimensiones: "900x400x2000mm", color: "Haya/roble" },
  "203.018": { desc: "Perchero de pie", material: "Base metálica, poste cromado", dimensiones: "Ø400x1700mm", color: "Cromado/negro" },
  "203.022": { desc: "Contenedor de almacenamiento", material: "Polietileno alta densidad / metálico", dimensiones: "Variable", color: "Gris/azul" },
  "204.001": { desc: "Banca de espera metálica 3 cuerpos", material: "Asiento madera contrachapada, estructura metálica", dimensiones: "1500x500x430mm", color: "Haya, estructura gris" },
  "204.002": { desc: "Banca de madera para exteriores", material: "Madera sólida tratada, estructura metálica", dimensiones: "1800x600x450mm", color: "Madera natural" },
  "204.003": { desc: "Silla adulto multiuso apilable", material: "Polipropileno, estructura metálica tubular", dimensiones: "450x450x800mm", color: "Colores variados, cromada" },
  "204.005": { desc: "Silla bacínica con apertura higiénica", material: "Aluminio, asiento polietileno", dimensiones: "500x500x850mm", color: "Gris/blanco" },
  "204.006": { desc: "Silla ergonómica respaldo alto administrativa", material: "Malla respaldo, espuma inyectada, base nylon", dimensiones: "Regulable, asiento 450x450mm", color: "Negro" },
  "204.006B": { desc: "Taburete con ruedas sin respaldo clínico", material: "Espuma asiento, base cromada", dimensiones: "Ø350, altura 450-600mm", color: "Negro/gris" },
  "204.007": { desc: "Silla lactante baja para sala cuna", material: "Madera y espuma tapizada", dimensiones: "400x400x300mm", color: "Colores infantiles" },
  "204.009": { desc: "Silla párvulo para niños", material: "Polipropileno resistente", dimensiones: "340x340x560mm", color: "Colores variados" },
  "204.010": { desc: "Silla tipo casino para comedor", material: "Polipropileno, estructura metálica", dimensiones: "440x440x800mm", color: "Blanco/gris, cromada" },
  "204.011": { desc: "Silla tipo universitaria con paleta", material: "Polipropileno, paleta melamina, metálica", dimensiones: "450x500x800mm", color: "Azul/gris, paleta haya" },
  "204.012": { desc: "Silla visita con brazos apilable", material: "Espuma tapizada, estructura cromada", dimensiones: "450x550x800mm", color: "Tapiz azul/gris/negro" },
  "204.013": { desc: "Sillón 1 cuerpo para salas de espera", material: "Espuma alta densidad, tapiz antibacteriano", dimensiones: "700x750x800mm", color: "Azul/gris institucional" },
  "204.014": { desc: "Sillón 2 cuerpos", material: "Espuma alta densidad, tapiz antibacteriano", dimensiones: "1300x750x800mm", color: "Azul/gris institucional" },
  "204.015": { desc: "Sillón bergere reclinable hospitalización", material: "Espuma HR, tapiz antibacteriano lavable", dimensiones: "700x800x1050mm", color: "Azul/gris" },
  "204.019": { desc: "Silla apoyo hora ingesta con bandeja", material: "Metálica, polipropileno con bandeja", dimensiones: "500x500x850mm", color: "Blanco/gris" },
  "204.020": { desc: "Butaca espera 3 cuerpos", material: "Polipropileno, estructura metálica", dimensiones: "1700x550x800mm", color: "Azul/gris, cromada" },
};

// ── Ollama API call ──
async function callOllama(
  messages: { role: string; content: string }[],
): Promise<string> {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: false,
      options: { temperature: 0.3, num_ctx: 8192 },
    }),
    signal: AbortSignal.timeout(120000),
  });

  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  const data = await res.json();
  return data.message?.content || "Sin respuesta del modelo.";
}

// ── Public API ──
class ChatServiceClass {
  private data: RawItem[] = [];
  private summary: SummaryData | null = null;
  private eettFiles: EETTFile[] = [];
  private systemPrompt = "";
  private ollamaAvailable: boolean | null = null;
  private conversationHistory: { role: string; content: string }[] = [];

  setData(data: RawItem[], summary: SummaryData, eettFiles: EETTFile[]) {
    this.data = data;
    this.summary = summary;
    this.eettFiles = eettFiles;
    this.systemPrompt = buildSystemPrompt(data, summary, eettFiles);
  }

  async checkHealth(): Promise<boolean> {
    if (this.ollamaAvailable !== null) return this.ollamaAvailable;
    try {
      const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(3000) });
      this.ollamaAvailable = res.ok;
    } catch {
      this.ollamaAvailable = false;
    }
    return this.ollamaAvailable;
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  async sendMessage(
    message: string,
    _sessionId?: string,
    _history?: Message[]
  ): Promise<
    | { response: { id: string; response: string; sessionId: string; tokensUsed: number; model: string; timestamp: string }; error: null }
    | { response: null; error: ChatError }
  > {
    if (!this.summary || this.data.length === 0) {
      return { response: null, error: { error: true, message: "Datos no cargados", code: "NO_DATA" } };
    }

    const isOllamaUp = await this.checkHealth();

    if (!isOllamaUp) {
      return {
        response: null,
        error: {
          error: true,
          message: "Ollama no está disponible",
          code: "OLLAMA_UNAVAILABLE",
          suggestion: "Inicia Ollama en tu computador: ejecuta 'ollama serve' y luego 'ollama pull mistral'. El chat requiere Ollama corriendo en localhost:11434.",
        },
      };
    }

    try {
      // Add user message to conversation
      this.conversationHistory.push({ role: "user", content: message });

      // Keep last 10 messages to avoid context overflow
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      // Build messages array for Ollama
      const ollamaMessages = [
        { role: "system", content: this.systemPrompt },
        ...this.conversationHistory,
      ];

      const answer = await callOllama(ollamaMessages);

      // Add assistant response to history
      this.conversationHistory.push({ role: "assistant", content: answer });

      return {
        response: {
          id: Math.random().toString(36).substr(2, 9),
          response: answer,
          sessionId: "ollama-local",
          tokensUsed: 0,
          model: MODEL,
          timestamp: new Date().toISOString(),
        },
        error: null,
      };
    } catch (err) {
      // Reset availability on error
      this.ollamaAvailable = null;
      const isTimeout = err instanceof DOMException && err.name === "TimeoutError";
      return {
        response: null,
        error: {
          error: true,
          message: isTimeout ? "Ollama tardó demasiado en responder" : "Error al comunicarse con Ollama",
          code: isTimeout ? "TIMEOUT" : "OLLAMA_ERROR",
          suggestion: "Verifica que Ollama esté corriendo: 'ollama serve'",
        },
      };
    }
  }
}

export const ChatService = new ChatServiceClass();
