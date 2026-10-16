import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { OrdersComponent } from './features/orders/orders.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { LoadPlanningComponent } from './features/load-planning/load-planning.component';
import { RouteOptimizationComponent } from './features/route-optimization/route-optimization.component';
import { CarrierManagementComponent } from './features/carrier-management/carrier-management.component';
import { RatingComponent } from './features/rating/rating.component';
import { TenderingComponent } from './features/tendering/tendering.component';
import { DocumentsComponent } from './features/documents/documents.component';
import { FreightAuditComponent } from './features/freight-audit/freight-audit.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Sign in · NexLog' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
  { path: 'orders', component: OrdersComponent, title: 'Orders' },
  { path: 'orders/:id', component: OrderDetailComponent, title: 'Order Detail' },
  { path: 'load-planning', component: LoadPlanningComponent, title: 'Load Planning' },
  { path: 'route-optimization', component: RouteOptimizationComponent, title: 'Route Optimization' },
  { path: 'carrier-management', component: CarrierManagementComponent, title: 'Carrier Management' },
  { path: 'rating', component: RatingComponent, title: 'Rating / Quote' },
  { path: 'tendering', component: TenderingComponent, title: 'Tendering' },
  { path: 'documents', component: DocumentsComponent, title: 'Document Management' },
  { path: 'freight-audit', component: FreightAuditComponent, title: 'Freight Audit & Payment' },
  { path: '**', redirectTo: 'dashboard' }
];
