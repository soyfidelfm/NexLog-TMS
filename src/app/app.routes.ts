import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
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
import { AnalyticsComponent } from './analytics/analytics.component';
import { ExceptionManagementComponent } from './features/exception-management/exception-management.component';
import { ClientPortalComponent } from './features/client-portal/client-portal.component';
import { RateTablesComponent } from './features/rate-tables/rate-tables.component';
import { TrackingComponent } from './features/tracking/tracking.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'routes.login' },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, title: 'routes.dashboard' },
      { path: 'orders', component: OrdersComponent, title: 'routes.orders' },
      { path: 'orders/:id', component: OrderDetailComponent, title: 'routes.orderDetail' },
      { path: 'load-planning', component: LoadPlanningComponent, title: 'routes.loadPlanning' },
      { path: 'route-optimization', component: RouteOptimizationComponent, title: 'routes.routeOptimization' },
      { path: 'carrier-management', component: CarrierManagementComponent, title: 'routes.carrierManagement' },
      { path: 'rating', component: RatingComponent, title: 'routes.rating' },
      { path: 'tendering', component: TenderingComponent, title: 'routes.tendering' },
      { path: 'documents', component: DocumentsComponent, title: 'routes.documents' },
      { path: 'freight-audit', component: FreightAuditComponent, title: 'routes.freightAudit' },
      { path: 'tracking', component: TrackingComponent, title: 'routes.tracking' },
      { path: 'exceptions', component: ExceptionManagementComponent, title: 'routes.exceptions' },
      { path: 'analytics', component: AnalyticsComponent, title: 'routes.analytics' },
      { path: 'client-portal', component: ClientPortalComponent, title: 'routes.clientPortal' },
      { path: 'rate-tables', component: RateTablesComponent, title: 'routes.rateTables' },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
