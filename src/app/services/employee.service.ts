import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { client } from '../apollo-client';
import { gql } from '@apollo/client/core';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor() {}

  getAllEmployees(): Observable<any> {
    const query = gql`
      query GetAllEmployees {
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

    return new Observable(observer => {
      client
        .query({ query })
        .then(result => {
          observer.next(result.data.getAllEmployees);
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  searchEmployeeById(id: string): Observable<any> {
    const query = gql`
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

    return new Observable(observer => {
      client
        .query({ query, variables: { id } })
        .then(result => {
          observer.next(result.data.searchEmployeeById);
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  searchByDesignationOrDepartment(designation?: string, department?: string): Observable<any> {
    const query = gql`
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

    return new Observable(observer => {
      client
        .query({ query, variables: { designation, department } })
        .then(result => {
          observer.next(result.data.searchEmployeeByDesignationOrDepartment);
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  addEmployee(employee: any, file?: File): Observable<any> {
    const mutation = gql`
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

    return new Observable(observer => {
      client
        .mutate({
          mutation,
          variables: {
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            gender: employee.gender,
            designation: employee.designation,
            salary: employee.salary,
            date_of_joining: employee.date_of_joining,
            department: employee.department,
            employee_photo: file || null,
          },
        })
        .then(result => {
          observer.next(result.data.addEmployee);
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  updateEmployee(id: string, employee: any, file?: File): Observable<any> {
    const mutation = gql`
      mutation UpdateEmployee(
        $id: ID!
        $first_name: String
        $last_name: String
        $email: String
        $gender: String!  # Updated to match schema (required)
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

    if (!employee.gender) {
      throw new Error('Gender is required for updating an employee');
    }
  
    return new Observable(observer => {
      client
        .mutate({
          mutation,
          variables: {
            id,
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            gender: employee.gender,
            designation: employee.designation,
            salary: employee.salary,
            date_of_joining: employee.date_of_joining,
            department: employee.department,
            employee_photo: file || null,
          },
        })
        .then(result => {
          observer.next(result.data.updateEmployee);
          observer.complete();
        })
        .catch(error => {
          console.error('Apollo error:', error); 
          const errorMessage = error.message || 'Failed to update employee';
          observer.error(new Error(errorMessage));
        });
    });
  }

  deleteEmployee(id: string): Observable<any> {
    const mutation = gql`
      mutation DeleteEmployee($id: ID!) {
        deleteEmployee(id: $id)
      }
    `;

    return new Observable(observer => {
      client
        .mutate({ mutation, variables: { id } })
        .then(result => {
          observer.next(result.data.deleteEmployee);
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }
}