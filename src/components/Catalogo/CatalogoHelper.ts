/**
 * Utilidades para detectar y manejar referencias al catálogo en mensajes del chat
 */

/**
 * Detecta referencias a páginas del catálogo en un texto
 * Busca patrones como "página 3", "p. 5", "page 4", etc.
 */
export function detectCatalogoPages(text: string): number[] {
  const pages: Set<number> = new Set();

  // Patrones a buscar
  const patterns = [
    /p[aá]gina[s]?\s+(\d+)/gi,        // "página 3", "páginas 3"
    /p\.\s*(\d+)/gi,                   // "p. 3"
    /page\s+(\d+)/gi,                  // "page 3"
    /cat[aá]logo.*?p[aá]gina\s+(\d+)/gi, // "catálogo página 3"
    /(?:ver|muestra|revisar|consultar).*?p[aá]gina\s+(\d+)/gi, // "ver página 3"
    /p[aá]gina\s+(\d+)\s+(?:del|de)\s+cat[aá]logo/gi, // "página 3 del catálogo"
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const pageNum = parseInt(match[1], 10);
      if (pageNum > 0) {
        pages.add(pageNum);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

/**
 * Detecta si el mensaje menciona el catálogo
 */
export function mentionsCatalogo(text: string): boolean {
  const catalogoKeywords = [
    'catálogo',
    'catalogo',
    'melman',
    'página del catálogo',
    'muestra la página',
    'ver página',
    'catalogo melman'
  ];

  const lowerText = text.toLowerCase();
  return catalogoKeywords.some(keyword => lowerText.includes(keyword));
}

/**
 * Extrae las páginas que el usuario solicita explícitamente
 */
export function extractRequestedPages(userMessage: string): number[] {
  const pages: Set<number> = new Set();

  // Buscar peticiones como "muestra página X" o "página X del catálogo"
  const patterns = [
    /(?:muestra|show|página|page|mira|ver)\s+(?:la\s+)?página\s+(\d+)/gi,
    /página\s+(\d+)/gi,
    /catalogo.*?página\s+(\d+)/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(userMessage)) !== null) {
      const pageNum = parseInt(match[1], 10);
      if (pageNum > 0) {
        pages.add(pageNum);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

/**
 * Formatter para renderizar páginas del catálogo en mensajes
 * Convierte referencias de página a componentes
 */
export function formatCatalogoReference(pageNum: number): string {
  return `[CATALOGO_PAGE:${pageNum}]`;
}

/**
 * Detecta marcadores de catálogo en texto
 */
export function extractCatalogoMarkers(text: string): number[] {
  const pages: Set<number> = new Set();
  const regex = /\[CATALOGO_PAGE:(\d+)\]/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const pageNum = parseInt(match[1], 10);
    if (pageNum > 0) {
      pages.add(pageNum);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

/**
 * Divide un texto por marcadores de catálogo
 * Retorna segmentos alternados de texto y página numbers
 */
export function splitByMarkers(text: string): (string | number)[] {
  const parts: (string | number)[] = [];
  const regex = /\[CATALOGO_PAGE:(\d+)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Añadir texto anterior
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index).trim());
    }

    // Añadir número de página
    const pageNum = parseInt(match[1], 10);
    if (pageNum > 0) {
      parts.push(pageNum);
    }

    lastIndex = regex.lastIndex;
  }

  // Añadir texto final
  if (lastIndex < text.length) {
    const final = text.slice(lastIndex).trim();
    if (final) parts.push(final);
  }

  return parts.filter(p => p !== '');
}
