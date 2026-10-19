export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type ExceptionStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  actor: string;
}

export interface ActionTaken {
  id: string;
  action: string;
  by: string;
  at: string;
  notes?: string;
}

export interface CommLog {
  id: string;
  channel: 'Email' | 'Phone' | 'SMS' | 'Chat' | 'System';
  from: string;
  to: string;
  message: string;
  at: string;
  direction: 'inbound' | 'outbound';
}

export interface ExceptionItem {
  id: string;
  type: string;
  title: string;
  loadId: string;
  orderId?: string;
  carrier: string;
  severity: Severity;
  status: ExceptionStatus;
  openedAt: string;
  lastUpdate: string;
  location: string;
  description: string;
  timeline: TimelineEvent[];
  actions: ActionTaken[];
  communications: CommLog[];
}
