import { ChatMessage } from "../types/chat";
import { config } from "../config";

// Sample data interfaces matching the dashboard
interface RawItem {
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

interface SummaryData {
  totalItems: number;
  totalUnits: number;
  uniqueRooms: number;
  furnitureTypes: number;
  floors: number;
  services: number;
  suppliers: number;
  byFamily: { [key: string]: number };
  bySupplier: { [key: string]: number };
  byFloor: { [key: string]: number };
  topServices: { servicio: string; count: number }[];
}

class ContextService {
  buildSystemPrompt(): string {
    return `Eres un asistente útil para el Sistema de Gestión de Documentos (SGD) del Hospital Buin Paine.
Tu rol es ayudar con preguntas sobre el inventario de mobiliario no clínico del hospital.

Instrucciones:
1. Responde solo preguntas sobre inventario de muebles, ubicaciones, proveedores, pisos y servicios
2. Proporciona estadísticas basadas en los datos proporcionados
3. Sé conciso y profesional
4. Si se te pregunta algo fuera del inventario, redirecciona amablemente
5. Cita datos específicos cuando proporciones estadísticas
6. Responde siempre en español
7. Formatea tablas grandes en formato markdown para claridad

Fecha actual: ${new Date().toLocaleDateString("es-ES")}`;
  }

  buildDataContext(summary: SummaryData): string {
    const familyStats = Object.entries(summary.byFamily || {})
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .map(([family, count]) => `- ${family}: ${count} unidades`)
      .join("\n");

    const supplierStats = Object.entries(summary.bySupplier || {})
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .map(([supplier, count]) => `- ${supplier}: ${count} unidades`)
      .join("\n");

    const floorStats = Object.entries(summary.byFloor || {})
      .sort()
      .map(([floor, count]) => `- Piso ${floor}: ${count} unidades`)
      .join("\n");

    const serviceStats = (summary.topServices || [])
      .slice(0, 10)
      .map((s) => `- ${s.servicio}: ${s.count} unidades`)
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

  buildPrompt(
    systemPrompt: string,
    dataContext: string,
    userMessage: string,
    conversationHistory?: ChatMessage[]
  ): string {
    let history = "";
    if (conversationHistory && conversationHistory.length > 0) {
      history = "\n=== HISTORIAL DE CONVERSACIÓN ===\n";
      const recentMessages = conversationHistory.slice(-6); // Keep last 6 messages
      for (const msg of recentMessages) {
        const role = msg.role === "user" ? "Usuario" : "Asistente";
        history += `${role}: ${msg.content}\n`;
      }
      history += "=== FIN HISTORIAL ===\n";
    }

    return `${systemPrompt}\n\n${dataContext}${history}\nUsuario: ${userMessage}\nAsistente:`;
  }

  sanitizeUserMessage(message: string): string {
    // Remove control characters
    let sanitized = message.replace(/[\x00-\x1F]/g, "");
    // Limit length
    sanitized = sanitized.slice(0, 1000);
    return sanitized.trim();
  }

  countTokensApprox(text: string): number {
    // Rough approximation: 1 token ≈ 4 characters
    // For Spanish, slightly less efficient
    return Math.ceil(text.length / 3.5);
  }
}

export const contextService = new ContextService();
