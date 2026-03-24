import { Component, OnInit } from '@angular/core';
import { LettersService } from './letters.service';

@Component({
  selector: 'app-letters',
  templateUrl: './letters.component.html',
  styleUrls: ['./letters.component.scss'],
  standalone: false
})
export class LettersComponent implements OnInit {
  letterTypes: any[] = [];
  selectedLetterType = '';
  selectedEmployeeId: number | null = null;
  additionalParams: any = {};
  loading = false;
  generatedLetter: any = null;

  constructor(private lettersService: LettersService) {}

  ngOnInit(): void {
    this.loadLetterTypes();
  }

  loadLetterTypes(): void {
    this.lettersService.getLetterTypes().subscribe({
      next: (response) => {
        if (response.success) {
          this.letterTypes = response.data || [];
        }
      },
      error: (error) => {
        console.error('Error loading letter types:', error);
      }
    });
  }

  onLetterTypeChange(): void {
    const selectedType = this.letterTypes.find(t => t.type === this.selectedLetterType);
    if (selectedType) {
      // Reset additional params based on requirements
      this.additionalParams = {};
      selectedType.requires.forEach((req: string) => {
        this.additionalParams[req] = null;
      });
    }
  }

  generateLetter(): void {
    if (!this.selectedLetterType || !this.selectedEmployeeId) {
      alert('Please select letter type and employee');
      return;
    }

    const selectedType = this.letterTypes.find(t => t.type === this.selectedLetterType);
    const missingParams = selectedType.requires.filter((req: string) => !this.additionalParams[req]);
    
    if (missingParams.length > 0) {
      alert('Please provide: ' + missingParams.join(', '));
      return;
    }

    this.loading = true;
    const params = {
      letter_type: this.selectedLetterType,
      employee_id: this.selectedEmployeeId,
      ...this.additionalParams
    };

    this.lettersService.generateLetter(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.generatedLetter = response.data;
          // Open letter in new window
          if (this.generatedLetter.letter_url) {
            window.open(this.generatedLetter.letter_url, '_blank');
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error generating letter:', error);
        this.loading = false;
      }
    });
  }

  downloadLetter(): void {
    if (this.generatedLetter && this.generatedLetter.letter_url) {
      window.open(this.generatedLetter.letter_url, '_blank');
    }
  }

  getSelectedLetterDescription(): string {
    if (!this.selectedLetterType) return '';
    const letterType = this.letterTypes.find(t => t.type === this.selectedLetterType);
    return letterType?.description || '';
  }

  getAdditionalParamsKeys(): string[] {
    return Object.keys(this.additionalParams);
  }

  formatParamLabel(param: string): string {
    return param.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getObject(): typeof Object {
    return Object;
  }
}

