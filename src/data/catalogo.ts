import type { CatalogoPage, CatalogItem } from "../types";

/**
 * Catálogo Melman - Integración con Chat IA
 *
 * Las páginas se renderizan en el navegador usando pdfjs-dist
 * El PDF está almacenado en /public/catalogo-melman.pdf
 *
 * Formato:
 * - CatalogoPage: Metadatos de cada página del PDF
 * - CatalogItem: Items individuales del catálogo (productos, servicios, etc.)
 */

// Generar metadatos para todas las páginas del catálogo
// Páginas disponibles: 3 a 74 (desde archivos individuales)
const generateCatalogoPages = (): CatalogoPage[] => {
  const pages: CatalogoPage[] = [];

  // Portada y Índice (placeholders para páginas 1-2)
  pages.push({
    number: 1,
    title: "Portada",
    pdfUrl: "/catalogo-melman.pdf",
    content: "Catálogo Melman para Licitación Hospital Buin Paine",
    section: "Portada"
  });

  pages.push({
    number: 2,
    title: "Índice / Tabla de Contenidos",
    pdfUrl: "/catalogo-melman.pdf",
    content: "Tabla de contenidos del catálogo",
    section: "Índice"
  });

  // Páginas individuales 3-74
  for (let i = 3; i <= 74; i++) {
    pages.push({
      number: i,
      title: `Página ${i}`,
      pdfUrl: `/catalogo/pages/page-${i}.pdf`,
      content: `Página ${i} del catálogo`,
      section: "Contenido"
    });
  }

  return pages;
};

export const catalogo: CatalogoPage[] = generateCatalogoPages();

/**
 * Items del catálogo - productos y servicios
 * Se pueden extraer mediante OCR o ingresa manualmente
 * Para búsqueda y referencia desde el chat IA
 */
export const catalogoItems: CatalogItem[] = [
  // Ejemplo de estructura
  // Los datos reales se deben extraer/ingresar según el contenido del catálogo
  {
    id: "CAT-001",
    nombre: "Producto Melman 1",
    descripcion: "Descripción del primer producto",
    pagina: 3,
    categoria: "Productos",
    precio: 0,
    especificaciones: {
      material: "Acero",
      dimensiones: "Según especificaciones"
    }
  }
];

/**
 * Configuración del catálogo para el chat IA
 */
export const catalogoConfig = {
  pdfUrl: "/catalogo/pages/page-{N}.pdf",
  pdfUrlFull: "/catalogo-melman.pdf",
  totalPages: 74,
  searchable: true,
  downloadable: true,
  description: "Catálogo oficial Melman para licitación Hospital Buin Paine",
  pagesAvailable: "1-74 (páginas 3-74 como PDFs individuales)"
};

/**
 * Helper para buscar items en el catálogo
 */
export function buscarEnCatalogo(query: string): CatalogItem[] {
  const queryLower = query.toLowerCase();
  return catalogoItems.filter(
    item =>
      item.nombre.toLowerCase().includes(queryLower) ||
      item.descripcion.toLowerCase().includes(queryLower) ||
      item.categoria?.toLowerCase().includes(queryLower)
  );
}

/**
 * Helper para obtener página específica del catálogo
 */
export function obtenerPaginaCatalogo(pageNumber: number): CatalogoPage | undefined {
  return catalogo.find(page => page.number === pageNumber);
}

/**
 * Helper para obtener items por página
 */
export function obtenerItemsPorPagina(pageNumber: number): CatalogItem[] {
  return catalogoItems.filter(item => item.pagina === pageNumber);
}
