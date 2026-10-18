export interface KPI {
  title: string;
  value: string;
  change: string;
  changePositive: boolean;
  icon: string;
  color: string;
  sparkline?: number[];
}

export interface Alert {
  id: string;
  type: 'delay' | 'exception' | 'cost' | 'weather';
  title: string;
  description: string;
  time: string;
  icon: string;
  color: string;
}
