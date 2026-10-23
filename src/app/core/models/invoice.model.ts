export type AuditStatus = 'Pending' | 'Approved' | 'Disputed' | 'Adjusted';

export interface InvoiceLine {
  description: string;
  expected: number;
  billed: number;
}

export interface FreightInvoice {
  id: string;
  carrier: string;
  loadId: string;
  invoiceDate: string;
  status: AuditStatus;
  lines: InvoiceLine[];
  /** Totals computed by the API; sent back unchanged on PUT. */
  expectedTotal?: number;
  billedTotal?: number;
  variance?: number;
}
