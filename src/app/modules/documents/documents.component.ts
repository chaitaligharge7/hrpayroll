import { Component, OnInit } from '@angular/core';
import { DocumentsService } from './documents.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  standalone: false
})
export class DocumentsComponent implements OnInit {
  documents: any[] = [];
  loading = false;
  filters = {
    employee_id: null,
    document_type: ''
  };

  constructor(private documentsService: DocumentsService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.loading = true;
    const params = { ...this.filters };

    this.documentsService.getDocuments(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.documents = response.data || [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading documents:', error);
        this.loading = false;
      }
    });
  }

  uploadDocument(): void {
    // Open upload modal/form
  }

  downloadDocument(documentPath: string): void {
    this.documentsService.downloadDocument(documentPath).subscribe({
      next: (response) => {
        // Handle file download
      },
      error: (error) => {
        console.error('Error downloading document:', error);
      }
    });
  }

  onFilterChange(): void {
    this.loadDocuments();
  }
}

