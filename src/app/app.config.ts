// import { ApplicationConfig, importProvidersFrom } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { LoginComponent } from './components/login/login.component';
// import { SignupComponent } from './components/signup/signup.component';
// import { EmployeeListComponent } from './components/employee-list/employee-list.component';
// import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
// import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
// import { AuthGuard } from './guards/auth.guard';
// import { HttpClientModule } from '@angular/common/http';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter([
//       { path: 'login', component: LoginComponent },
//       { path: 'signup', component: SignupComponent },
//       { path: 'employees', component: EmployeeListComponent, canActivate: [AuthGuard] },
//       { path: 'employee/:id', component: EmployeeDetailComponent, canActivate: [AuthGuard], data: { renderMode: 'ssr' }},
//       { path: 'employee-form', component: EmployeeFormComponent, canActivate: [AuthGuard] },
//       { path: '', redirectTo: '/login', pathMatch: 'full' },
//     ]),
//     importProvidersFrom(HttpClientModule), // Provide HttpClientModule for HTTP requests
//   ],
// };

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations()
  ]
};