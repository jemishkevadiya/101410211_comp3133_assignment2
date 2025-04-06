import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatTooltipModule,
  ],
  template: `
    <mat-card class="fade-in">
      <mat-card-header>
        <mat-card-subtitle>Manage your team efficiently</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="search-form">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Designation</mat-label>
            <input matInput formControlName="designation" placeholder="Designation" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Department</mat-label>
            <input matInput formControlName="department" placeholder="Department" />
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" class="search-button">
            Search
          </button>
        </form>

        <table mat-table [dataSource]="employees" class="mat-elevation-z8">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let employee">
              <span class="highlight">{{ employee.first_name }} {{ employee.last_name }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let employee">{{ employee.email }}</td>
          </ng-container>
          <ng-container matColumnDef="designation">
            <th mat-header-cell *matHeaderCellDef>Designation</th>
            <td mat-cell *matCellDef="let employee">{{ employee.designation }}</td>
          </ng-container>
          <ng-container matColumnDef="department">
            <th mat-header-cell *matHeaderCellDef>Department</th>
            <td mat-cell *matCellDef="let employee">
              <span class="department-chip">{{ employee.department }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let employee">
              <button mat-raised-button (click)="viewDetails(employee.id)" color="primary" matTooltip="View Details">
                View
              </button>
              <button mat-raised-button (click)="editEmployee(employee.id)" color="accent" matTooltip="Edit Employee">
                Edit
              </button>
              <button mat-raised-button (click)="deleteEmployee(employee.id)" color="warn" matTooltip="Delete Employee">
                Delete
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="employee-row"></tr>
        </table>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="addEmployee()" class="add-button">
          Add Employee
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    mat-card {
      width: 100%;
      height: 86vh;
      margin: 0;
      padding: 20px;
    }
    mat-card-header {
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    mat-card-subtitle {
      color: #888;
      font-size: 1.2rem;
      margin-bottom: 20px;
    }
    .search-form {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }
    .search-field {
      flex: 1;
      min-width: 200px;
    }
    .search-button {
      background: #6e48aa; 
      height: 50px;
      color: white;
    }
    .mat-elevation-z8 {
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
    }
    th {
      background: #e6f7ff;
      font-weight: 600;
      color: #6e48aa;
    }
    td {
      padding: 12px;
      color: #333;
    }
    .employee-row {
      transition: background-color 0.3s ease;
    }
    .employee-row:hover {
      background-color: #e6f7ff;
    }
    .highlight {
      font-weight: 500;
      color: #6e48aa;
    }
    .department-chip {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 16px;
      background: #e0f7fa;
      color: #006064;
      font-size: 0.9rem;
    }
    .add-button {
      background: #6e48aa; 
      top: 70%;
      height: 130%;
      color: white;
    }
    button[mat-raised-button] {
      margin: 0 4px;
    }
  `],
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  searchForm!: FormGroup;
  displayedColumns: string[] = ['name', 'email', 'designation', 'department', 'actions'];

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      designation: [''],
      department: [''],
    });
  }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => (this.employees = employees),
      error: (err) => console.error(err),
    });
  }

  onSearch() {
    const { designation, department } = this.searchForm.value;
    this.employeeService
      .searchByDesignationOrDepartment(designation || undefined, department || undefined)
      .subscribe({
        next: (employees) => (this.employees = employees),
        error: (err) => console.error(err),
      });
  }

  viewDetails(id: string) {
    this.router.navigate(['/employee', id]);
  }

  editEmployee(id: string) {
    this.router.navigate(['/employee-form'], { queryParams: { id } });
  }

  deleteEmployee(id: string) {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => this.loadEmployees(),
      error: (err) => console.error(err),
    });
  }

  addEmployee() {
    this.router.navigate(['/employee-form']);
  }
}