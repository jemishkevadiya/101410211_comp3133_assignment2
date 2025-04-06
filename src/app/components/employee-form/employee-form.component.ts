import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  template: `
    <mat-card class="fade-in">
      <mat-card-header>
        <mat-card-title>{{ id ? 'Edit Employee' : 'Add Employee' }}</mat-card-title>
        <mat-card-subtitle>{{ id ? 'Update employee details' : 'Add a new employee to the system' }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="first_name" placeholder="First Name" />
              <mat-error *ngIf="employeeForm.get('first_name')?.hasError('required')">
                First Name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="last_name" placeholder="Last Name" />
              <mat-error *ngIf="employeeForm.get('last_name')?.hasError('required')">
                Last Name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" placeholder="Email" type="email" />
              <mat-error *ngIf="employeeForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="employeeForm.get('email')?.hasError('email')">
                Invalid email format
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Gender</mat-label>
              <mat-select formControlName="gender">
                <mat-option value="MALE">Male</mat-option>
                <mat-option value="FEMALE">Female</mat-option>
                <mat-option value="OTHER">Other</mat-option>
              </mat-select>
              <mat-error *ngIf="employeeForm.get('gender')?.hasError('required')">
                Gender is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Designation</mat-label>
              <input matInput formControlName="designation" placeholder="Designation" />
              <mat-error *ngIf="employeeForm.get('designation')?.hasError('required')">
                Designation is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Salary</mat-label>
              <input matInput type="number" formControlName="salary" placeholder="Salary" />
              <mat-error *ngIf="employeeForm.get('salary')?.hasError('required')">
                Salary is required
              </mat-error>
              <mat-error *ngIf="employeeForm.get('salary')?.hasError('min')">
                Salary must be at least 1000
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Date of Joining</mat-label>
              <input matInput type="date" formControlName="date_of_joining" placeholder="Date of Joining" />
              <mat-error *ngIf="employeeForm.get('date_of_joining')?.hasError('required')">
                Date of Joining is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Department</mat-label>
              <input matInput formControlName="department" placeholder="Department" />
              <mat-error *ngIf="employeeForm.get('department')?.hasError('required')">
                Department is required
              </mat-error>
            </mat-form-field>

            <div class="file-upload">
              <label for="employee-photo" class="file-label">
                Upload Profile Photo
              </label>
              <input id="employee-photo" type="file" (change)="onFileChange($event)" class="file-input" />
            </div>
          </div>

          <mat-card-actions>
            <button mat-raised-button color="primary" type="submit" [disabled]="employeeForm.invalid">
              {{ id ? 'Update' : 'Add' }}
            </button>
            <button mat-raised-button color="warn" type="button" (click)="cancel()">
              Cancel
            </button>
          </mat-card-actions>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card {
      width: 100%;
      margin: 0;
      padding: 30px;
    }
    mat-card-header {
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 15px;
      margin-bottom: 30px;
    }
    mat-card-subtitle {
      color: #888;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .file-upload {
      grid-column: span 2;
      text-align: center;
    }
    .file-label {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: #6e48aa;
      color: white;
      border-radius: 25px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    .file-label:hover {
      background: #6e48aa;
    }
    .file-input {
      display: none;
    }
    mat-card-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    button[mat-raised-button][color="primary"] {
      background: #6e48aa;
      color: white;
    }
    button[mat-raised-button][color="warn"] {
      background: #6e48aa;
      color: white;
    }
  `],
})
export class EmployeeFormComponent implements OnInit {
  employeeForm!: FormGroup;
  id: string | null = null;
  file: File | undefined;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.queryParamMap.get('id');
    console.log('Employee ID from query params:', this.id);
    if (this.id) {
      this.employeeService.searchEmployeeById(this.id).subscribe({
        next: (employee) => {
          console.log('Employee data retrieved:', employee);
          const mappedEmployee = {
            first_name: employee.firstName || employee.first_name,
            last_name: employee.lastName || employee.last_name,
            email: employee.email,
            gender: employee.gender,
            designation: employee.designation,
            salary: employee.salary,
            date_of_joining: employee.dateOfJoining || employee.date_of_joining,
            department: employee.department,
          };
          this.employeeForm.patchValue(mappedEmployee);
        },
        error: (err) => {
          console.error('Error fetching employee:', err);
        },
      });
    } else {
      console.log('No employee ID provided; assuming new employee form');
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.file = input.files[0];
    }
  }

  onSubmit() {
    const employee = this.employeeForm.value;
    console.log('Submitting employee data:', employee);
    console.log('File to upload:', this.file);
    if (this.id) {
      this.employeeService.updateEmployee(this.id, employee, this.file).subscribe({
        next: () => {
          console.log('Employee updated successfully');
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          console.error('Error updating employee:', err);
          console.log('Error status:', err.status);
          console.log('Error message:', err.message);
          console.log('Error details:', err.error);
          alert('Failed to update employee. Please try again. Error: ' + (err.message || 'Unknown error'));
        },
      });
    } else {
      this.employeeService.addEmployee(employee, this.file).subscribe({
        next: () => {
          console.log('Employee added successfully');
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          console.error('Error adding employee:', err);
          console.log('Error status:', err.status);
          console.log('Error message:', err.message);
          console.log('Error details:', err.error);
          alert('Failed to add employee. Please try again. Error: ' + (err.message || 'Unknown error'));
        },
      });
    }
  }
  
  cancel() {
    this.router.navigate(['/employees']);
  }
}