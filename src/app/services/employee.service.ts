import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:1024/graphql';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {}

  private getAuthHeaders(): HttpHeaders {
    let token: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  getAllEmployees(): Observable<any> {
    const query = `
      query {
        getAllEmployees {
          id
          first_name
          last_name
          email
          gender
          designation
          salary
          date_of_joining
          department
          employee_photo
        }
      }
    `;
    return this.http
      .post(this.apiUrl, { query }, { headers: this.getAuthHeaders() })
      .pipe(map((response: any) => response.data.getAllEmployees));
  }

  searchEmployeeById(id: string): Observable<any> {
    const query = `
      query SearchEmployeeById($id: ID!) {
        searchEmployeeById(id: $id) {
          id
          first_name
          last_name
          email
          gender
          designation
          salary
          date_of_joining
          department
          employee_photo
        }
      }
    `;
    return this.http
      .post(this.apiUrl, { query, variables: { id } }, { headers: this.getAuthHeaders() })
      .pipe(map((response: any) => response.data.searchEmployeeById));
  }

  searchByDesignationOrDepartment(designation?: string, department?: string): Observable<any> {
    const query = `
      query SearchEmployeeByDesignationOrDepartment($designation: String, $department: String) {
        searchEmployeeByDesignationOrDepartment(designation: $designation, department: $department) {
          id
          first_name
          last_name
          email
          gender
          designation
          salary
          date_of_joining
          department
          employee_photo
        }
      }
    `;
    return this.http
      .post(this.apiUrl, { query, variables: { designation, department } }, { headers: this.getAuthHeaders() })
      .pipe(map((response: any) => response.data.searchEmployeeByDesignationOrDepartment));
  }

  addEmployee(employee: any, file?: File): Observable<any> {
    const mutation = `
      mutation AddEmployee(
        $first_name: String!
        $last_name: String!
        $email: String!
        $gender: String!
        $designation: String!
        $salary: Float!
        $date_of_joining: String!
        $department: String!
        $employee_photo: Upload
      ) {
        addEmployee(
          first_name: $first_name
          last_name: $last_name
          email: $email
          gender: $gender
          designation: $designation
          salary: $salary
          date_of_joining: $date_of_joining
          department: $department
          employee_photo: $employee_photo
        ) {
          id
          first_name
          last_name
          email
          gender
          designation
          salary
          date_of_joining
          department
          employee_photo
        }
      }
    `;

    let token: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token');
    }

    if (file) {
      const formData = new FormData();
      formData.append('operations', JSON.stringify({ query: mutation, variables: employee }));
      formData.append('map', JSON.stringify({ '0': ['variables.employee_photo'] }));
      formData.append('0', file);
      return this.http
        .post(this.apiUrl, formData, { headers: { Authorization: token ? `Bearer ${token}` : '' } })
        .pipe(map((response: any) => response.data.addEmployee));
    }

    return this.http
      .post(this.apiUrl, { query: mutation, variables: employee }, { headers: this.getAuthHeaders() })
      .pipe(map((response: any) => response.data.addEmployee));
  }

  updateEmployee(id: string, employee: any, file?: File): Observable<any> {
    const mutation = `
      mutation UpdateEmployee(
        $id: ID!
        $first_name: String
        $last_name: String
        $email: String
        $gender: String
        $designation: String
        $salary: Float
        $date_of_joining: String
        $department: String
        $employee_photo: Upload
      ) {
        updateEmployee(
          id: $id
          first_name: $first_name
          last_name: $last_name
          email: $email
          gender: $gender
          designation: $designation
          salary: $salary
          date_of_joining: $date_of_joining
          department: $department
          employee_photo: $employee_photo
        ) {
          id
          first_name
          last_name
          email
          gender
          designation
          salary
          date_of_joining
          department
          employee_photo
        }
      }
    `;

    console.log('Updating employee with variables:', { id, ...employee, employee_photo: file });

    let token: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token');
    }

    if (file) {
      const formData = new FormData();
      formData.append('operations', JSON.stringify({ query: mutation, variables: { id, ...employee } }));
      formData.append('map', JSON.stringify({ '0': ['variables.employee_photo'] }));
      formData.append('0', file);
      return this.http
        .post(this.apiUrl, formData, { headers: { Authorization: token ? `Bearer ${token}` : '' } })
        .pipe(
          map((response: any) => {
            console.log('Update response:', response);
            if (response.errors) {
              throw new Error(response.errors[0].message);
            }
            return response.data.updateEmployee;
          })
        );
    }

    return this.http
      .post(this.apiUrl, { query: mutation, variables: { id, ...employee } }, { headers: this.getAuthHeaders() })
      .pipe(
        map((response: any) => {
          console.log('Update response:', response);
          if (response.errors) {
            throw new Error(response.errors[0].message);
          }
          return response.data.updateEmployee;
        })
      );
  }

  deleteEmployee(id: string): Observable<any> {
    const mutation = `
      mutation DeleteEmployee($id: ID!) {
        deleteEmployee(id: $id)
      }
    `;
    return this.http
      .post(this.apiUrl, { query: mutation, variables: { id } }, { headers: this.getAuthHeaders() })
      .pipe(map((response: any) => response.data.deleteEmployee));
  }
}