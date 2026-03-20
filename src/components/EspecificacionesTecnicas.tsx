import React, { useState, useEffect } from 'react';
import type { SharePointFile } from '../services/sharePointService';
import { sharePointService } from '../services/sharePointService';
import './EspecificacionesTecnicas.css';

const EspecificacionesTecnicas: React.FC = () => {
  const [files, setFiles] = useState<SharePointFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<SharePointFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📁 Cargando archivos desde OneDrive for Business...');
      const fetchedFiles = await sharePointService.getFilesFromSharePoint();
      
      console.log(`📊 Archivos encontrados: ${fetchedFiles.length}`);
      setFiles(fetchedFiles);
      
      if (fetchedFiles.length > 0 && !selectedFile) {
        setSelectedFile(fetchedFiles[0]);
      }
    } catch (error) {
      console.error('❌ Error cargando archivos:', error);
      setError('Error al cargar los archivos. Por favor, intenta nuevamente.');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (file: SharePointFile) => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.nombre;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleViewInSharePoint = (file: SharePointFile) => {
    if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  return (
    <div className="especificaciones-tecnicas">
      <div className="eett-header">
        <h1>Especificaciones Técnicas (EETT)</h1>
        <button 
          className="refresh-button" 
          onClick={loadFiles}
          disabled={loading}
        >
          {loading ? '⏳ Cargando...' : '🔄 Actualizar'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <div className="eett-container">
        <div className="files-list">
          <h2>Archivos Disponibles ({files.length})</h2>
          {loading && <p className="loading-message">Cargando archivos...</p>}
          {!loading && files.length === 0 && (
            <p className="no-files-message">No se encontraron archivos PDF</p>
          )}
          {files.map((file, index) => (
            <div
              key={index}
              className={`file-item ${selectedFile?.nombre === file.nombre ? 'active' : ''}`}
              onClick={() => setSelectedFile(file)}
            >
              <div className="file-icon">📄</div>
              <div className="file-info">
                <div className="file-name">{file.nombre}</div>
                <div className="file-size">
                  {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Tamaño desconocido'}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="file-viewer">
          {selectedFile ? (
            <>
              <div className="viewer-header">
                <h2>{selectedFile.nombre}</h2>
                <div className="viewer-actions">
                  <button 
                    className="action-button download-button"
                    onClick={() => handleDownload(selectedFile)}
                  >
                    ⬇️ Descargar
                  </button>
                  <button 
                    className="action-button view-button"
                    onClick={() => handleViewInSharePoint(selectedFile)}
                  >
                    🔗 Ver en SharePoint
                  </button>
                </div>
              </div>
              <div className="viewer-content">
                <iframe
                  src={`${selectedFile.url}?embedded=true`}
                  title={selectedFile.nombre}
                  width="100%"
                  height="600px"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </>
          ) : (
            <div className="no-file-selected">
              <p>Selecciona un archivo para visualizarlo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EspecificacionesTecnicas;
