// Google Drive Service para obtener archivos PDF de la carpeta compartida
// Carpeta: https://drive.google.com/drive/folders/1OtRagCXrjq10EDTZTmnQYrrZW-UkJGzb?usp=sharing
// Google Apps Script: https://script.google.com/macros/s/AKfycbye-6sa4Bu5jSGxC_yEC4upfJlA_Ts1pfR2junWD7Rc58XHhk8pEzBQlKRyHtjZVfde/exec

export interface GoogleDriveFile {
  nombre: string;
  id: string;
  url: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
}

class GoogleDriveService {
  private folderID = '1OtRagCXrjq10EDTZTmnQYrrZW-UkJGzb';
  private scriptUrl = 'https://script.google.com/macros/s/AKfycbye-6sa4Bu5jSGxC_yEC4upfJlA_Ts1pfR2junWD7Rc58XHhk8pEzBQlKRyHtjZVfde/exec';

  async getFilesFromFolder(): Promise<GoogleDriveFile[]> {
    try {
      // Llamar al Google Apps Script para obtener los archivos PDF
      const response = await fetch(this.scriptUrl);
      
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status}`);
      }

      const data = await response.json();
      
      // Si hay error en el script, retornar array vacío
      if (data.error) {
        console.error('Error del Google Apps Script:', data.error);
        return [];
      }

      // Mapear los archivos y agregar URL
      const files: GoogleDriveFile[] = data.map((file: any) => ({
        nombre: file.nombre,
        id: file.id,
        url: this.getViewUrl(file.id),
        mimeType: file.mimeType,
        modifiedTime: file.modifiedTime,
        size: file.size,
      }));

      return files;
    } catch (error) {
      console.error('Error obteniendo archivos de Google Drive:', error);
      return [];
    }
  }

  // Obtener URL de preview para un archivo PDF
  getPreviewUrl(fileId: string): string {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  // Obtener URL de descarga para un archivo PDF
  getDownloadUrl(fileId: string): string {
    return `https://drive.google.com/uc?id=${fileId}&export=download`;
  }

  // Obtener URL de visualización completa
  getViewUrl(fileId: string): string {
    return `https://drive.google.com/file/d/${fileId}/view`;
  }
}

export const googleDriveService = new GoogleDriveService();
export type { GoogleDriveFile };
