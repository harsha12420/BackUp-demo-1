import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor(private toastr: ToastrService) { }

  exportData(exportType: string, headerRow, data, fileName: string, format = {}) {
    switch (exportType) {
      case 'pdf':
        this.exportToPDF(
          headerRow,
          data,
          fileName,
          format
        );
        break;
      case 'excel':
        this.exportToExcel(
          data,
          fileName
        );
        break;
      case 'csv':
        this.exportToCSV(
          data,
          fileName
        );
        break;
      default:
    }
  }

  exportToPDF(headerRow: string[], data: any[][], fileName: string, format = {}) {
    try {
      const pdf = new jsPDF();

      (pdf as any).autoTable({
        head: [headerRow],
        body: data,
        columnStyles: format
      });
      pdf.save(fileName + ".pdf");
      this.toastr.success('File Exported Successfully!');

    } catch (error) {
      this.toastr.error('Error While Exporting File')
    }
  }

  exportToCSV(data: any[], filename: string) {
    try {
      const csvContent = data.map((row) => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `${filename}.csv`);
      this.toastr.success('File Exported Successfully!');
    } catch (error) {
      this.toastr.error('Error While Exporting File')
    }
  }

  exportToExcel(data: any[], filename: string) {
    try {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const excelArray: ArrayBuffer = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'array',
      });

      const blob = new Blob([excelArray], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      this.toastr.success('File Exported Successfully!');
    } catch (error) {
      this.toastr.error('Error While Exporting File')
    }
  }
}
