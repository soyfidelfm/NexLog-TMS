import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ExceptionItem } from '../models';

@Injectable({ providedIn: 'root' })
export class ExceptionService {
  private mockExceptions: ExceptionItem[] = [
    {
      id: 'EXC-2026-0142',
      type: 'Delay',
      title: 'Pickup delay – driver no-show',
      loadId: 'LD-2026-0842',
      orderId: 'ORD-1051',
      carrier: 'Swift Transportation',
      severity: 'Critical',
      status: 'Open',
      openedAt: '2026-10-15T08:42',
      lastUpdate: '2026-10-15T11:15',
      location: 'Los Angeles, CA',
      description: 'Driver failed to arrive for scheduled pickup. Customer is escalating. Window closes in 90 min.',
      timeline: [
        { time: '08:42', title: 'Exception opened', description: 'Auto-detected: no GPS check-in at origin', actor: 'System' },
        { time: '08:55', title: 'Carrier notified', description: 'SMS + email sent to dispatch', actor: 'Ops Bot' },
        { time: '09:30', title: 'Customer alerted', description: 'Proactive notification sent', actor: 'Maria Lopez' },
        { time: '11:15', title: 'Escalated', description: 'No response from carrier. Escalated to supervisor', actor: 'Maria Lopez' },
      ],
      actions: [
        { id: 'A1', action: 'Sent carrier notification', by: 'Ops Bot', at: '08:55', notes: 'SMS + email' },
        { id: 'A2', action: 'Called carrier dispatch', by: 'Maria Lopez', at: '09:18', notes: 'No answer, left voicemail' },
        { id: 'A3', action: 'Escalated to supervisor', by: 'Maria Lopez', at: '11:15' },
      ],
      communications: [
        { id: 'C1', channel: 'SMS', from: 'NexLog', to: 'Swift Dispatch', message: 'Pickup missed for LD-2026-0842. Confirm ETA.', at: '08:55', direction: 'outbound' },
        { id: 'C2', channel: 'Email', from: 'ops@nexlog.com', to: 'dispatch@swift.com', message: 'Urgent: Driver no-show at Acme Corp dock. Please respond.', at: '08:56', direction: 'outbound' },
        { id: 'C3', channel: 'Phone', from: 'Maria Lopez', to: 'Swift Dispatch', message: 'Called, left voicemail requesting immediate callback.', at: '09:18', direction: 'outbound' },
        { id: 'C4', channel: 'Chat', from: 'Customer Portal', to: 'Ops', message: 'When will the truck arrive? Production is waiting.', at: '10:40', direction: 'inbound' },
      ],
    },
    {
      id: 'EXC-2026-0145',
      type: 'Damage',
      title: 'Cargo damage reported at delivery',
      loadId: 'LD-2026-0835',
      orderId: 'ORD-1040',
      carrier: 'Knight-Swift',
      severity: 'High',
      status: 'In Progress',
      openedAt: '2026-10-14T16:20',
      lastUpdate: '2026-10-15T09:05',
      location: 'Phoenix, AZ',
      description: 'Receiver reported 3 pallets crushed. Photos uploaded. Claim process initiated.',
      timeline: [
        { time: '16:20', title: 'Damage reported', description: 'POD notes + photos from driver', actor: 'Driver App' },
        { time: '16:45', title: 'Claim opened', description: 'Auto-claim created in system', actor: 'System' },
        { time: '09:05', title: 'Carrier response', description: 'Carrier acknowledged, requesting survey', actor: 'Claims Team' },
      ],
      actions: [
        { id: 'A1', action: 'Opened claim', by: 'System', at: '16:45' },
        { id: 'A2', action: 'Requested photos review', by: 'Claims Bot', at: '17:10' },
        { id: 'A3', action: 'Contacted carrier claims', by: 'James Park', at: '09:05' },
      ],
      communications: [
        { id: 'C1', channel: 'System', from: 'Driver App', to: 'Claims', message: 'Damage photos uploaded (3 pallets).', at: '16:22', direction: 'inbound' },
        { id: 'C2', channel: 'Email', from: 'claims@nexlog.com', to: 'claims@knightswift.com', message: 'Claim EXC-2026-0145 opened. Please review attached photos.', at: '16:50', direction: 'outbound' },
      ],
    },
    {
      id: 'EXC-2026-0148',
      type: 'Capacity',
      title: 'Trailer overweight risk',
      loadId: 'LD-2026-0848',
      carrier: 'Schneider',
      severity: 'Medium',
      status: 'Open',
      openedAt: '2026-10-15T07:10',
      lastUpdate: '2026-10-15T07:10',
      location: 'Irvine, CA',
      description: 'Projected weight exceeds trailer max by 1,200 lbs after last order assignment.',
      timeline: [
        { time: '07:10', title: 'Alert generated', description: 'Load planning engine detected overweight risk', actor: 'System' },
      ],
      actions: [
        { id: 'A1', action: 'Flagged for planner review', by: 'System', at: '07:10' },
      ],
      communications: [],
    },
    {
      id: 'EXC-2026-0151',
      type: 'Documentation',
      title: 'Missing BOL signature',
      loadId: 'LD-2026-0831',
      orderId: 'ORD-1031',
      carrier: 'Werner Enterprises',
      severity: 'Low',
      status: 'Resolved',
      openedAt: '2026-10-13T14:00',
      lastUpdate: '2026-10-14T10:30',
      location: 'Salt Lake City, UT',
      description: 'BOL not signed by receiver. Follow-up completed.',
      timeline: [
        { time: '14:00', title: 'Exception opened', description: 'POD received without signature', actor: 'System' },
        { time: '10:30', title: 'Resolved', description: 'Signature obtained via e-sign link', actor: 'Ana Ruiz' },
      ],
      actions: [
        { id: 'A1', action: 'Sent e-sign link', by: 'Ana Ruiz', at: '09:15' },
        { id: 'A2', action: 'Closed exception', by: 'Ana Ruiz', at: '10:30' },
      ],
      communications: [
        { id: 'C1', channel: 'Email', from: 'docs@nexlog.com', to: 'receiver@example.com', message: 'Please sign the BOL via the secure link.', at: '09:15', direction: 'outbound' },
      ],
    },
    {
      id: 'EXC-2026-0154',
      type: 'Weather',
      title: 'Route impacted by storm',
      loadId: 'LD-2026-0857',
      carrier: 'J.B. Hunt',
      severity: 'High',
      status: 'In Progress',
      openedAt: '2026-10-15T12:40',
      lastUpdate: '2026-10-15T13:10',
      location: 'Albuquerque, NM',
      description: 'Severe weather delay expected. ETA pushed +6 hours. Customer notified.',
      timeline: [
        { time: '12:40', title: 'Weather alert', description: 'External weather API flagged route', actor: 'System' },
        { time: '13:05', title: 'ETA updated', description: 'New ETA communicated to customer', actor: 'Ops Bot' },
        { time: '13:10', title: 'Driver instructed', description: 'Hold at safe location until storm passes', actor: 'Dispatch' },
      ],
      actions: [
        { id: 'A1', action: 'Updated ETA', by: 'Ops Bot', at: '13:05' },
        { id: 'A2', action: 'Notified customer', by: 'Ops Bot', at: '13:06' },
      ],
      communications: [
        { id: 'C1', channel: 'SMS', from: 'NexLog', to: 'Customer', message: 'Your shipment LD-2026-0857 is delayed due to weather. New ETA +6h.', at: '13:06', direction: 'outbound' },
      ],
    },
  ];

  getExceptions(): Observable<ExceptionItem[]> {
    return of(this.mockExceptions);
  }

  updateStatus(id: string, status: ExceptionItem['status']): Observable<ExceptionItem | undefined> {
    const item = this.mockExceptions.find(e => e.id === id);
    if (item) {
      item.status = status;
      item.lastUpdate = new Date().toISOString();
    }
    return of(item);
  }
}
