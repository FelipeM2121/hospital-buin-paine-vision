import { msalInstance } from '../msalInstance';

// Inline interface to avoid import issues
export interface SharePointFile {
  nombre: string;
  url: string;
  size: number;
  modified: Date;
  type: 'PDF' | 'DOCX' | 'XLSX' | 'OTHER';
}

class SharePointService {
  private msalInstance: any;

  constructor() {
    this.msalInstance = msalInstance;
  }

  async getAccessToken(): Promise<string> {
    try {
      const request = {
        scopes: ['Files.Read.All'],
        forceRefresh: false,
      };

      // Intenta obtener token en silencio
      try {
        const response = await this.msalInstance.acquireTokenSilent(request);
        return response.accessToken;
      } catch (error) {
        // Si falla, intenta con popup
        const response = await this.msalInstance.acquireTokenPopup(request);
        return response.accessToken;
      }
    } catch (error) {
      console.error('❌ Error al obtener token:', error);
      throw error;
    }
  }

  async getFilesFromSharePoint(): Promise<SharePointFile[]> {
    try {
      console.log('📁 Iniciando carga de archivos desde OneDrive for Business...');
      const accessToken = await this.getAccessToken();
      console.log('✅ Token de acceso obtenido');
      
      const driveItemUrl = 'https://graph.microsoft.com/v1.0/me/drive/root:/Documents/Dashboard/EETT:/children';
      console.log('🔗 Consultando:', driveItemUrl);
      
      const response = await fetch(driveItemUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📊 Respuesta API:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Error en API:', errorData);
        throw new Error(`SharePoint API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 Items encontrados:', data.value?.length || 0);
      
      if (!data.value || data.value.length === 0) {
        console.warn('⚠️ No se encontraron archivos en la carpeta');
        return [];
      }

      const files: SharePointFile[] = data.value
        .filter((item: any) => item.name.toLowerCase().endsWith('.pdf'))
        .sort((a: any, b: any) => b.name.localeCompare(a.name))
        .map((item: any) => {
          const downloadUrl = item['@microsoft.graph.downloadUrl'];
          console.log(`📄 Archivo: ${item.name} - URL: ${downloadUrl ? 'Disponible' : 'No disponible'}`);
          
          return {
            nombre: item.name,
            url: downloadUrl || item.webUrl || '',
            size: item.size || 0,
            modified: item.lastModifiedDateTime ? new Date(item.lastModifiedDateTime) : new Date(),
            type: 'PDF' as const,
          };
        });

      console.log(`✅ Se cargaron ${files.length} archivos PDF`);
      return files;
    } catch (error) {
      console.error('❌ Error en getFilesFromSharePoint:', error);
      throw error;
    }
  }
}

export const sharePointService = new SharePointService();
