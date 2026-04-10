import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  generatedLetters: any[] = [];

  constructor(private lettersService: LettersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLetterTypes();
  }
  onLetterTypeClick(event: Event) {
  (event.target as HTMLSelectElement).focus();
}

  loadLetterTypes(): void {
    this.lettersService.getLetterTypes().subscribe({
      next: (response) => {
        if (response.success) {
          this.letterTypes = response.data || [];
          this.cdr.detectChanges();
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


//   generateLetter() {
//   if (!this.selectedLetterType || !this.selectedEmployeeId) return;

//   this.loading = true;
//   this.lettersService.generateLetter({
//   type: this.selectedLetterType,
//   employeeId: this.selectedEmployeeId,
//   additionalParams: this.additionalParams
// }).subscribe(
//   (res: any) => {  // add type annotation
//     this.generatedLetter = res; 
//     this.generatedLetters.push(res);
//     this.loading = false;
//   },
//   (err: any) => {   // add type annotation
//     console.error(err);
//     this.loading = false;
//   }
// );
//   }

generateLetter() {
  if (!this.selectedLetterType || !this.selectedEmployeeId) {
    alert('Please select letter type and employee ID');
    return;
  }

  const payload = {
    letter_type: this.selectedLetterType,
    employee_id: this.selectedEmployeeId,
    additional_params: this.additionalParams || {}
  };

  console.log('Payload:', payload);

  this.lettersService.generateLetter(payload).subscribe({
    next: (res) => {
      this.generatedLetter = res.data;
      this.generatedLetters.push(res.data);
      this.loading = false;
    },
    error: (err) => {
      console.error('API Error:', err);
      this.loading = false;
    }
  });
}
downloadLetter(letter?: any): void {
  const file = letter || this.generatedLetter;

  if (!file?.download_url) return;

  const a = document.createElement('a');
  a.href = file.download_url; // backend download endpoint
  a.target = '_blank';
  a.click();
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

