import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { OrdersComponent } from './features/orders/orders.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component'; // ajusta la ruta si lo moviste
import { LoadPlanningComponent } from './features/load-planning/load-planning.component';
import { RouteOptimizationComponent } from './features/route-optimization/route-optimization.component';
import { CarrierManagementComponent } from './features/carrier-management/carrier-management.component';
import { RatingComponent } from './features/rating/rating.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'orders/:id', component: OrderDetailComponent },   // ← agrega esta
  { path: 'load-planning', component: LoadPlanningComponent, title: 'Load Planning' },
  { path: 'route-optimization', component: RouteOptimizationComponent, title: 'Route Optimization' },
  { path: 'carrier-management', component: CarrierManagementComponent, title: 'Carrier Management' },

  { path: 'rating', component: RatingComponent, title: 'Rating / Cotización' },
  { path: '**', redirectTo: 'dashboard' }
];