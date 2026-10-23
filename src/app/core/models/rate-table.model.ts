export interface RateTable {
  id: string;
  name: string;
  carrier: string;
  originZone: string;
  destinationZone: string;
  mode: string;
  rateType: string;
  baseRate: number;
  minCharge: number;
  fuelSurcharge: number;
  effectiveFrom: string;
  effectiveTo: string;
  status: 'Active' | 'Draft' | 'Expired';
}

export interface RolePermission {
  /** Slug id assigned by the API (e.g. `admin`). */
  id?: string;
  role: string;
  description: string;
  view: boolean;
  createEdit: boolean;
  delete: boolean;
  approve: boolean;
  export: boolean;
  managePermissions: boolean;
}
