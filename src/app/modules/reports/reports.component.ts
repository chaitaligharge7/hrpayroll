import { Component, OnInit } from '@angular/core';
import { ReportsService } from './reports.service';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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
    // Set default dates for attendance summary
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    this.filters.start_date = firstDay.toISOString().split('T')[0];
    this.filters.end_date = today.toISOString().split('T')[0];
    this.filters.payroll_month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
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
    if (format === 'excel' || format === 'xlsx') {
      this.exportToExcel(data);
    } else if (format === 'csv') {
      this.exportToCSV(data);
    } else if (format === 'pdf') {
      // PDF export handled by backend
      this.downloadBlob(data, 'application/pdf', `${this.selectedReportType}_report.pdf`);
    }
  }

  private async exportToExcel(data: any[]): Promise<void> {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Report');

      // Add headers
      if (data.length > 0) {
        const headers = Object.keys(data[0]);
        worksheet.addRow(headers.map(h => this.formatHeader(h)));

        // Style header row
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' }
        };

        // Add data rows
        data.forEach(row => {
          const values = headers.map(header => row[header] || '');
          worksheet.addRow(values);
        });

        // Auto-fit columns
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

      // Generate buffer and download
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
          // Escape commas and quotes in CSV
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

  private downloadBlob(data: any, contentType: string, filename: string): void {
    try {
      // If data is base64 encoded
      if (typeof data === 'string' && data.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = data;
        link.download = filename;
        link.click();
      } else if (data instanceof Blob) {
        saveAs(data, filename);
      } else {
        // Assume it's a base64 string
        const byteCharacters = atob(data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType });
        saveAs(blob, filename);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file. Please try again.');
    }
  }
}
