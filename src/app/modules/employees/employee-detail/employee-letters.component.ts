import { Component, OnInit, Input, SimpleChanges, OnChanges } from "@angular/core";
import { LettersService } from "../../letters/letters.service";
import { ChangeDetectorRef } from "@angular/core"; // ✅ NEW

@Component({
  selector: "app-employee-letters",
  templateUrl: "./employee-letters.component.html",
  styleUrls: ["./employee-letters.component.scss"],
  standalone: false,
})
export class EmployeeLettersComponent implements OnChanges {
  @Input() employeeId!: number;

  availableLetters = [
    { type: "joining", name: "Joining Letter", icon: "fa-file-alt" },
    {
      type: "appointment",
      name: "Appointment Letter",
      icon: "fa-file-contract",
    },
    {
      type: "experience",
      name: "Experience Certificate",
      icon: "fa-certificate",
    },
    {
      type: "salary_certificate",
      name: "Salary Certificate",
      icon: "fa-money-check",
    },
  ];

  loading = false;
  isReady = false; // ✅ NEW

  constructor(private lettersService: LettersService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["employeeId"] && this.employeeId) {
      console.log("Employee ID received:", this.employeeId);
      this.isReady = true; // ✅ component ready to render
    }
  }

  generateLetter(letterType: string, additionalParams: any = {}): void {
    if (!this.employeeId) return; // safety

    this.loading = true;

    const params = {
      letter_type: letterType,
      employee_id: this.employeeId,
      ...additionalParams,
    };

    this.lettersService.generateLetter(params).subscribe({
      next: (response) => {
        if (response.success && response.data?.letter_url) {
          // Create a download link instead of opening in new window
          const link = document.createElement('a');
          link.href = response.data.letter_url;
          link.download = `${letterType}_letter.pdf`;
          link.click();
        } else {
          console.error('Failed to generate letter:', response.message || 'Unknown error');
          alert(response.message || 'Failed to generate letter');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error("Error generating letter:", error);
        alert('Error generating letter. Please try again.');
        this.loading = false;
      },
    });
  }
}