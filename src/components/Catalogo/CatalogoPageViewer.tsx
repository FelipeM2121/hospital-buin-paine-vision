import React, { useState } from 'react';
import { Download, ChevronLeft, Search, FileText, Award, BookOpen, X } from 'lucide-react';
import { productosCatalogo, certificadosCatalogo, productosPortada, buscarProducto, categorias, type ProductoCatalogo } from '../../data/catalogo';

type Tab = "productos" | "certificados" | "indice";

interface CatalogoPageViewerProps {
  pageNumber?: number;
  showControls?: boolean;
  showDownload?: boolean;
  onPageChange?: (newPage: number) => void;
  totalPages?: number;
  productoId?: string;
}

const BASE = import.meta.env.BASE_URL ?? "/";
const resolveUrl = (url: string) =>
  url.startsWith("/") ? BASE.replace(/\/$/, "") + url : url;

export const CatalogoPageViewer: React.FC<CatalogoPageViewerProps> = ({ productoId }) => {
  const [tab, setTab] = useState<Tab>("productos");
  const [busqueda, setBusqueda] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoCatalogo | null>(
    productoId ? productosCatalogo.find(p => p.id === productoId) ?? null : null
  );

  const resultadosBusqueda = busqueda.trim() ? buscarProducto(busqueda) : null;
  const productosMostrados = resultadosBusqueda
    ? resultadosBusqueda.filter(p => p.tipo === "producto")
    : productosCatalogo;
  const certsMostrados = resultadosBusqueda
    ? resultadosBusqueda.filter(p => p.tipo === "certificado")
    : certificadosCatalogo;

  const handleDescargar = (p: ProductoCatalogo) => {
    const link = document.createElement('a');
    link.href = resolveUrl(p.url);
    link.download = p.archivo;
    link.click();
  };

  if (productoSeleccionado) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", background: "#F8F9FA", borderRadius: "10px", padding: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", borderRadius: "8px", padding: "10px 14px", border: "1px solid #E5E7EB" }}>
          <button onClick={() => setProductoSeleccionado(null)} style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "none", border: "none", cursor: "pointer",
            color: "#2563EB", fontSize: "13px",
          }}>
            <ChevronLeft size={16} />
            Volver al catálogo
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>
              {productoSeleccionado.codigo} — {productoSeleccionado.nombre}
            </span>
            <button onClick={() => handleDescargar(productoSeleccionado)} style={{
              display: "flex", alignItems: "center", gap: "5px",
              background: "#3B82F6", color: "#fff", border: "none",
              borderRadius: "6px", padding: "6px 12px", cursor: "pointer",
              fontSize: "13px",
            }}>
              <Download size={13} />
              Descargar
            </button>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid #E5E7EB", overflow: "hidden", height: "65vh" }}>
          <iframe
            src={resolveUrl(productoSeleccionado.url)}
            title={productoSeleccionado.nombre}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </div>
      </div>
    );
  }

  const gruposCategoria = categorias.map(cat => ({
    categoria: cat,
    productos: productosMostrados.filter(p => p.categoria === cat),
  })).filter(g => g.productos.length > 0);

  const tabStyle = (id: Tab): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: "6px",
    padding: "8px 14px", fontSize: "13px", fontWeight: 500,
    background: "none", border: "none", cursor: "pointer",
    borderBottom: tab === id ? "2px solid #3B82F6" : "2px solid transparent",
    color: tab === id ? "#2563EB" : "#6B7280",
    transition: "color 0.15s",
  });

  const ProductoCard = ({ p }: { p: ProductoCatalogo }) => (
    <div
      onClick={() => setProductoSeleccionado(p)}
      style={{
        background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px",
        padding: "10px 12px", cursor: "pointer",
        transition: "border-color 0.15s, box-shadow 0.15s",
        display: "flex", flexDirection: "column", gap: "2px",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#93C5FD"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(59,130,246,0.15)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#E5E7EB"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "monospace", marginBottom: "2px" }}>{p.codigo}</div>
          <div style={{ fontSize: "13px", fontWeight: 500, color: "#1F2937", lineHeight: 1.3 }}>{p.nombre}</div>
          <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "3px" }}>{p.categoria}</div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); handleDescargar(p); }}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#9CA3AF", flexShrink: 0 }}
          onMouseEnter={e => (e.currentTarget.style.color = "#3B82F6")}
          onMouseLeave={e => (e.currentTarget.style.color = "#9CA3AF")}
          title="Descargar"
        >
          <Download size={13} />
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#F8F9FA", borderRadius: "10px", overflow: "hidden", border: "1px solid #E5E7EB" }}>
      {/* Búsqueda */}
      <div style={{ background: "#fff", padding: "10px 12px", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ position: "relative" }}>
          <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
          <input
            type="text"
            placeholder="Buscar producto, código o categoría…"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{
              width: "100%", paddingLeft: "32px", paddingRight: busqueda ? "32px" : "10px",
              paddingTop: "7px", paddingBottom: "7px",
              fontSize: "13px", border: "1px solid #E5E7EB", borderRadius: "8px",
              outline: "none", boxSizing: "border-box", background: "#F9FAFB",
            }}
          />
          {busqueda && (
            <button onClick={() => setBusqueda("")} style={{
              position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", padding: "2px", color: "#9CA3AF",
            }}>
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "2px", padding: "0 10px", background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
        <button style={tabStyle("productos")} onClick={() => setTab("productos")}>
          <FileText size={13} />
          Productos ({productosMostrados.length})
        </button>
        <button style={tabStyle("certificados")} onClick={() => setTab("certificados")}>
          <Award size={13} />
          Certificados ({certsMostrados.length})
        </button>
        <button style={tabStyle("indice")} onClick={() => setTab("indice")}>
          <BookOpen size={13} />
          Índice
        </button>
      </div>

      {/* Contenido */}
      <div style={{ padding: "12px", overflowY: "auto", maxHeight: "340px" }}>
        {tab === "productos" && (
          busqueda.trim() ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "8px" }}>
              {productosMostrados.length === 0
                ? <p style={{ color: "#6B7280", fontSize: "13px", gridColumn: "1/-1" }}>No se encontraron productos para "{busqueda}".</p>
                : productosMostrados.map(p => <ProductoCard key={p.id} p={p} />)
              }
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {gruposCategoria.map(({ categoria, productos }) => (
                <div key={categoria}>
                  <h3 style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px", margin: "0 0 8px 0" }}>{categoria}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "8px" }}>
                    {productos.map(p => <ProductoCard key={p.id} p={p} />)}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {tab === "certificados" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {(() => {
              const grupos: Record<string, ProductoCatalogo[]> = {};
              certsMostrados.forEach(c => {
                if (!grupos[c.categoria]) grupos[c.categoria] = [];
                grupos[c.categoria].push(c);
              });
              return Object.entries(grupos).map(([cat, items]) => (
                <div key={cat}>
                  <h3 style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>{cat}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "8px" }}>
                    {items.map(c => <ProductoCard key={c.id} p={c} />)}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}

        {tab === "indice" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "8px" }}>
            {productosPortada.map(p => <ProductoCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogoPageViewer;
