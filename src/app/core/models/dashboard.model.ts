/** Dashboard KPI card. Text is resolved through ngx-translate keys (ES/EN). */
export interface KPI {
  id?: string;
  /** Key under `dashboard.` (e.g. `kpiShipments`). */
  titleKey: string;
  value: string;
  /** Full translation key for the change line (e.g. `dashboard.changeVsDate`). */
  changeKey: string;
  changeParams?: Record<string, string | number>;
  changePositive: boolean;
  icon: string;
  color: string;
  sparkline?: number[];
}

/** Dashboard alert row. Text is resolved through ngx-translate keys (ES/EN). */
export interface Alert {
  id: string;
  type: 'delay' | 'exception' | 'cost' | 'weather';
  /** Key under `dashboard.` (e.g. `alertDelay`). */
  titleKey: string;
  /** Key under `dashboard.` (e.g. `alertDelayDesc`). */
  descKey: string;
  /** Full translation key for the relative time (e.g. `time.minAgo`). */
  timeKey: string;
  n: number;
  icon: string;
  color: string;
}
