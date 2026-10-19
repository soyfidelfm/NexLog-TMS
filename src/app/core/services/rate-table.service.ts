import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RateTable, RolePermission } from '../models';

@Injectable({ providedIn: 'root' })
export class RateTableService {
  private mockRateTables: RateTable[] = [
    {
      id: 'RT-001',
      name: 'West Coast TL Standard',
      carrier: 'Swift Transportation',
      originZone: 'CA, NV, AZ',
      destinationZone: 'All US',
      mode: 'TL',
      rateType: 'Per Mile',
      baseRate: 2.45,
      minCharge: 850,
      fuelSurcharge: 18.5,
      effectiveFrom: '2026-01-01',
      effectiveTo: '2026-12-31',
      status: 'Active',
    },
    {
      id: 'RT-002',
      name: 'LTL Regional East',
      carrier: 'FedEx Freight',
      originZone: 'NY, NJ, PA',
      destinationZone: 'Northeast',
      mode: 'LTL',
      rateType: 'Per CWT',
      baseRate: 18.75,
      minCharge: 125,
      fuelSurcharge: 22.0,
      effectiveFrom: '2026-03-01',
      effectiveTo: '2026-09-30',
      status: 'Active',
    },
    {
      id: 'RT-003',
      name: 'Intermodal Flat Rate',
      carrier: 'JB Hunt',
      originZone: 'Midwest',
      destinationZone: 'West Coast',
      mode: 'Intermodal',
      rateType: 'Flat',
      baseRate: 1850,
      minCharge: 1850,
      fuelSurcharge: 12.0,
      effectiveFrom: '2026-06-01',
      effectiveTo: '',
      status: 'Draft',
    },
  ];

  private mockRoles: RolePermission[] = [
    {
      role: 'Admin',
      description: 'Full system access',
      view: true,
      createEdit: true,
      delete: true,
      approve: true,
      export: true,
      managePermissions: true,
    },
    {
      role: 'Dispatcher',
      description: 'Operations & load planning',
      view: true,
      createEdit: true,
      delete: false,
      approve: false,
      export: true,
      managePermissions: false,
    },
    {
      role: 'Carrier Manager',
      description: 'Carrier relations & scoring',
      view: true,
      createEdit: true,
      delete: false,
      approve: true,
      export: true,
      managePermissions: false,
    },
    {
      role: 'Billing',
      description: 'Invoices & freight audit',
      view: true,
      createEdit: false,
      delete: false,
      approve: true,
      export: true,
      managePermissions: false,
    },
    {
      role: 'Read Only',
      description: 'View-only access',
      view: true,
      createEdit: false,
      delete: false,
      approve: false,
      export: false,
      managePermissions: false,
    },
  ];

  getRateTables(): Observable<RateTable[]> {
    return of(this.mockRateTables);
  }

  getRoles(): Observable<RolePermission[]> {
    return of(this.mockRoles);
  }

  saveRateTable(rate: RateTable): Observable<RateTable> {
    const idx = this.mockRateTables.findIndex(r => r.id === rate.id);
    if (idx >= 0) {
      this.mockRateTables[idx] = rate;
    } else {
      this.mockRateTables.push(rate);
    }
    return of(rate);
  }

  savePermissions(roles: RolePermission[]): Observable<RolePermission[]> {
    this.mockRoles = roles;
    return of(this.mockRoles);
  }
}
