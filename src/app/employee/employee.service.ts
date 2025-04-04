import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_ALL_EMPLOYEES, SEARCH_EMPLOYEE_BY_ID, SEARCH_EMPLOYEE_BY_DESIGNATION_OR_DEPARTMENT } from '../shared/graphql/queries';
import { ADD_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE } from '../shared/graphql/mutation';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(
    private apollo: Apollo,
    private snackBar: MatSnackBar
  ) {}

  getAllEmployees() {
    return this.apollo
      .query({ query: GET_ALL_EMPLOYEES })
      .pipe(map((result: any) => result.data.getAllEmployees));
  }

  searchEmployeeById(id: string) {
    return this.apollo
      .query({
        query: SEARCH_EMPLOYEE_BY_ID,
        variables: { id }
      })
      .pipe(map((result: any) => result.data.searchEmployeeById));
  }

  searchEmployeeByDesignationOrDepartment(designation?: string, department?: string) {
    return this.apollo
      .query({
        query: SEARCH_EMPLOYEE_BY_DESIGNATION_OR_DEPARTMENT,
        variables: { designation, department }
      })
      .pipe(map((result: any) => result.data.searchEmployeeByDesignationOrDepartment));
  }

  addEmployee(employee: any, file?: File) {
    return this.apollo
      .mutate({
        mutation: ADD_EMPLOYEE,
        variables: { ...employee, employee_photo: file || null },
        context: { useMultipart: true }
      })
      .pipe(
        map((result: any) => {
          this.snackBar.open('Employee added successfully!', 'Close', { duration: 3000 });
          return result.data.addEmployee;
        })
      );
  }

  updateEmployee(id: string, employee: any, file?: File) {
    return this.apollo
      .mutate({
        mutation: UPDATE_EMPLOYEE,
        variables: { id, ...employee, employee_photo: file || null },
        context: { useMultipart: true }
      })
      .pipe(
        map((result: any) => {
          this.snackBar.open('Employee updated successfully!', 'Close', { duration: 3000 });
          return result.data.updateEmployee;
        })
      );
  }

  deleteEmployee(id: string) {
    return this.apollo
      .mutate({
        mutation: DELETE_EMPLOYEE,
        variables: { id }
      })
      .pipe(
        map((result: any) => {
          this.snackBar.open('Employee deleted successfully!', 'Close', { duration: 3000 });
          return result.data.deleteEmployee;
        })
      );
  }
}