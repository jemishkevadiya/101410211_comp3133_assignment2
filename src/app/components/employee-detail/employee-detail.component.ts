import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule],
  template: `
    <mat-card class="fade-in">
      <mat-card-header>
        <mat-card-title>{{ employee?.first_name }} {{ employee?.last_name }}</mat-card-title>
        <mat-card-subtitle>{{ employee?.designation }} - {{ employee?.department }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="employee-details">
          <div class="photo-container">
            <img
              *ngIf="employee?.employee_photo; else placeholder"
              [src]="getPhotoUrl(employee.employee_photo)"
              alt="Employee Photo"
              class="profile-photo"
              (error)="onImageError()"
            />
            <ng-template #placeholder>
              <div class="photo-placeholder">
                <span>No Photo Available</span>
              </div>
            </ng-template>
          </div>
          <div class="details">
            <p><strong>Email:</strong> {{ employee?.email }}</p>
            <p><strong>Gender:</strong> {{ employee?.gender }}</p>
            <p><strong>Salary:</strong> {{ employee?.salary | currency }}</p>
            <p><strong>Date of Joining:</strong> {{ employee?.date_of_joining }}</p>
          </div>
        </div>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="goBack()">
          Back
        </button>
      </mat-card-actions>
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
      font-size: 1rem;
    }
    .employee-details {
      display: flex;
      gap: 40px;
      align-items: center;
      flex-wrap: wrap;
    }
    .photo-container {
      text-align: center;
    }
    .profile-photo {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #6e48aa;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .photo-placeholder {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #666;
      font-size: 14px;
      border: 4px dashed #888;
    }
    .details {
      flex: 1;
      min-width: 300px;
    }
    .details p {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 12px 0;
      font-size: 1rem;
    }
    button[mat-raised-button] {
      background: #6e48aa; 
      color: white;
    }
  `],
})
export class EmployeeDetailComponent implements OnInit {
  employee: any;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.employeeService.searchEmployeeById(id).subscribe({
      next: (employee) => (this.employee = employee),
      error: (err) => console.error(err),
    });
  }

  getPhotoUrl(photoPath: string): string {
    return `http://localhost:1024${photoPath}`;
  }

  onImageError() {
    console.error('Failed to load employee photo');
    this.employee.employee_photo = null;
  }

  goBack() {
    this.router.navigate(['/employees']);
  }
}