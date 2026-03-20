export interface SharePointFile {
  nombre: string
  url: string
  size: number
  modified: Date
  type: 'PDF' | 'DOCX' | 'XLSX' | 'OTHER'
}
