import { Component, OnInit } from '@angular/core';
import { ReportsService } from './reports.service';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RowInput, CellInput } from 'jspdf-autotable';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  standalone: false
})
export class ReportsComponent implements OnInit {
  reportTypes = [
    { value: 'employee_master', label: 'Employee Master List' },
    { value: 'attendance_summary', label: 'Attendance Summary' },
    { value: 'payroll_summary', label: 'Payroll Summary' },
    { value: 'leave_summary', label: 'Leave Summary' }
  ];

  selectedReportType = '';
  reportData: any[] = [];
  loading = false;
  filters: any = {
    start_date: '',
    end_date: '',
    payroll_month: '',
    year: new Date().getFullYear()
  };

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  this.filters.start_date = firstDay.toISOString().split('T')[0];
  this.filters.end_date = today.toISOString().split('T')[0];
  this.filters.payroll_month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  this.selectedReportType = this.reportTypes[0].value; 
}

onReportTypeChange(): void {
  this.reportData = []; 
  this.generateReport(); 
  const today = new Date();

 if (this.selectedReportType === 'attendance_summary') {
    const today = new Date();
    this.filters.start_date = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    this.filters.end_date = today.toISOString().split('T')[0];
  } else if (this.selectedReportType === 'payroll_summary') {
    const today = new Date();
    this.filters.payroll_month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  }
  this.generateReport();
}

  generateReport(): void {
    if (!this.selectedReportType) {
      alert('Please select a report type');
      return;
    }

    this.loading = true;
    const params = {
      report_type: this.selectedReportType,
      format: 'json',
      filters: { ...this.filters }
    };

    this.reportsService.generateReport(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.reportData = response.data.data || [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error generating report:', error);
        this.loading = false;
      }
    });
  }

 exportReport(format: string): void {
  const params = {
    report_type: this.selectedReportType,
    format: format,
    filters: { ...this.filters }
  };

  this.reportsService.generateReport(params).subscribe({
    next: (response) => {
      if (response.success) {
        this.downloadFile(response.data, format);
      }
    },
    error: (error) => {
      console.error('Error exporting report:', error);
    }
  });
}

  getTableHeaders(): string[] {
    if (this.reportData.length === 0) return [];
    return Object.keys(this.reportData[0]);
  }

  formatHeader(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

 private downloadFile(data: any, format: string): void {
  const reportArray = Array.isArray(data) ? data : data.data || [];
  if (format === 'excel' || format === 'xlsx') {
    this.exportToExcel(reportArray);
  } else if (format === 'csv') {
    this.exportToCSV(reportArray);
  } else if (format === 'pdf') {
    if (Array.isArray(reportArray) && reportArray.length > 0) {
      this.exportToPDF(reportArray);
    } else if (data instanceof Blob || (typeof data === 'string' && data.startsWith('data:'))) {
      this.downloadBlob(data, 'application/pdf', `${this.selectedReportType}_report.pdf`);
    } else {
      alert('No data available for PDF export.');
    }
  } else {
    console.warn('Unknown format:', format);
  }
}

  private async exportToExcel(data: any[]): Promise<void> {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Report');

      if (data.length > 0) {
        const headers = Object.keys(data[0]);
        worksheet.addRow(headers.map(h => this.formatHeader(h)));
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' }
        };

        data.forEach(row => {
          const values = headers.map(header => row[header] || '');
          worksheet.addRow(values);
        });

        worksheet.columns.forEach(column => {
          if (column && column.eachCell) {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
              const columnLength = cell.value ? cell.value.toString().length : 10;
              if (columnLength > maxLength) {
                maxLength = columnLength;
              }
            });
            if (column.width !== undefined) {
              column.width = maxLength < 10 ? 10 : maxLength + 2;
            }
          }
        });
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${this.selectedReportType}_report_${new Date().getTime()}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error exporting to Excel. Please try again.');
    }
  }

  private exportToCSV(data: any[]): void {
    try {
      if (data.length === 0) {
        alert('No data to export');
        return;
      }

      const headers = Object.keys(data[0]);
      const csvHeaders = headers.map(h => this.formatHeader(h)).join(',');
      
      const csvRows = data.map(row => {
        return headers.map(header => {
          const value = row[header] || '';
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',');
      });

      const csvContent = [csvHeaders, ...csvRows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${this.selectedReportType}_report_${new Date().getTime()}.csv`);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      alert('Error exporting to CSV. Please try again.');
    }
  }

   private exportToPDF(data: any[]): void {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  const doc = new jsPDF();
  const headers: string[] = Object.keys(data[0]).map(h => this.formatHeader(h));
  const rows: RowInput[] = data.map(row => {
  const values: CellInput[] = Object.values(row).map(val => {
      if (val === null || val === undefined) return '';
      if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        return val;
      }
      return JSON.stringify(val); 
    });
    return values;
  });

  autoTable(doc, {
    head: [headers],
    body: rows
  });

  doc.save(`${this.makeSafeFilename(this.selectedReportType)}_report_${new Date().getTime()}.pdf`);
}
  private makeSafeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
}
private downloadBlob(data: any, contentType: string, filename: string): void {
  try {
    // If data is object, maybe backend sent { data: <base64> }
    if (typeof data === 'object' && data.data) {
      data = data.data;
    }

    if (typeof data === 'string' && data.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = data;
      link.download = filename;
      link.click();
    } else if (data instanceof Blob) {
      saveAs(data, filename);
    } else if (typeof data === 'string') {
      const byteCharacters = atob(data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });
      saveAs(blob, filename);
    } else {
      console.error('Unsupported file data type', data);
      alert('Error downloading file. Unsupported format.');
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    alert('Error downloading file. Please try again.');
  }
}
}