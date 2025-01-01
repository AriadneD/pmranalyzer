// src/services/exportService.js

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function exportToExcel(data, fileName) {
  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'PMR Data');

  // Generate buffer
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  // Export
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, `${fileName}.xlsx`);
}