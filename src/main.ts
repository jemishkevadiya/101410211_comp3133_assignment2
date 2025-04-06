import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './app/components/login/login.component';
import { SignupComponent } from './app/components/signup/signup.component';
import { EmployeeListComponent } from './app/components/employee-list/employee-list.component';
import { EmployeeDetailComponent } from './app/components/employee-detail/employee-detail.component';
import { EmployeeFormComponent } from './app/components/employee-form/employee-form.component';
import { AuthGuard } from './app/guards/auth.guard';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'employees', component: EmployeeListComponent, canActivate: [AuthGuard] },
      { path: 'employee/:id', component: EmployeeDetailComponent, canActivate: [AuthGuard], data: { renderMode: 'ssr' }},
      { path: 'employee-form', component: EmployeeFormComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: '/login', pathMatch: 'full' },
    ]),
    importProvidersFrom(HttpClientModule), 
  ],
};