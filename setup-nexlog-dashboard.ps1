# NexLog TMS - Dashboard Setup Script
# Ejecutar desde: D:\Fidel\Repos\TMS\nexlog-tms
# PowerShell

$ErrorActionPreference = "Stop"
$root = "D:\Fidel\Repos\TMS\nexlog-tms"

if (-not (Test-Path $root)) {
    Write-Error "La carpeta $root no existe. Ejecuta este script desde la raíz del proyecto."
    exit 1
}

Set-Location $root

# Crear carpetas
$folders = @(
    "src\app\features\dashboard",
    "src\app\core\models",
    "src\app\shared\components",
    "src\app\layout"
)
foreach ($f in $folders) {
    New-Item -ItemType Directory -Force -Path $f | Out-Null
}

# ========== dashboard.component.ts ==========
@'
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

interface KPI {
  title: string;
  value: string;
  change: string;
  changePositive: boolean;
  icon: string;
  color: string;
  sparkline?: number[];
}

interface Alert {
  id: string;
  type: 'delay' | 'exception' | 'cost' | 'weather';
  title: string;
  description: string;
  time: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  kpis: KPI[] = [
    {
      title: 'Total Shipments Today',
      value: '1,248',
      change: '↑ 12.5% vs May 19, 2024',
      changePositive: true,
      icon: 'truck',
      color: 'blue',
      sparkline: [980, 1050, 1100, 1150, 1200, 1248]
    },
    {
      title: 'On-Time Delivery %',
      value: '92.6%',
      change: '↑ 3.4% vs May 19, 2024',
      changePositive: true,
      icon: 'check',
      color: 'green',
      sparkline: [88, 89, 90, 91, 92, 92.6]
    },
    {
      title: 'Freight Cost This Month',
      value: '$2.45M',
      change: '↓ 5.7% vs Apr 20 – May 19',
      changePositive: false,
      icon: 'dollar',
      color: 'purple',
      sparkline: [2.8, 2.7, 2.6, 2.5, 2.48, 2.45]
    },
    {
      title: 'Active Exceptions',
      value: '27',
      change: '↑ 8 vs May 19, 2024',
      changePositive: false,
      icon: 'alert',
      color: 'orange',
      sparkline: [15, 18, 20, 22, 25, 27]
    }
  ];

  weeklyVolumeLabels = ['May 20', 'May 21', 'May 22', 'May 23', 'May 24', 'May 25', 'May 26'];
  weeklyVolumeData: ChartData<'line'> = {
    labels: this.weeklyVolumeLabels,
    datasets: [
      {
        data: [980, 1100, 950, 1200, 1742, 1150, 980],
        label: 'Shipments',
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointHoverRadius: 6
      }
    ]
  };
  weeklyVolumeOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y.toLocaleString()} Shipments`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 2000,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
    }
  };
  weeklyVolumeType: ChartType = 'line';

  carriers = [
    { name: 'Primary Freight', percentage: 38.4, color: '#3b82f6' },
    { name: 'FastLane Logistics', percentage: 24.7, color: '#22c55e' },
    { name: 'NorthStar Transport', percentage: 16.1, color: '#a855f7' },
    { name: 'Velocity Express', percentage: 12.3, color: '#f97316' },
    { name: 'Other Carriers', percentage: 8.5, color: '#64748b' }
  ];

  alerts: Alert[] = [
    {
      id: '1',
      type: 'delay',
      title: 'Delay: Shipment #SHP0048912',
      description: 'Houston, TX → Phoenix, AZ • 2h 15m delay',
      time: '10 min ago',
      icon: 'alert-triangle',
      color: 'red'
    },
    {
      id: '2',
      type: 'exception',
      title: 'Carrier Exception: SHP0048876',
      description: 'Equipment issue reported',
      time: '35 min ago',
      icon: 'alert-circle',
      color: 'orange'
    },
    {
      id: '3',
      type: 'cost',
      title: 'High Freight Cost Alert',
      description: 'Route #RT-2093 above budget by 18%',
      time: '1h ago',
      icon: 'dollar-sign',
      color: 'yellow'
    },
    {
      id: '4',
      type: 'weather',
      title: 'Weather Advisory: Southeast',
      description: 'Storms expected to impact delivery',
      time: '2h ago',
      icon: 'cloud-rain',
      color: 'blue'
    }
  ];

  mapMarkers = [
    { x: 20, y: 40, color: 'blue', status: 'In Transit' },
    { x: 25, y: 55, color: 'blue', status: 'In Transit' },
    { x: 35, y: 45, color: 'green', status: 'Out for Delivery' },
    { x: 45, y: 50, color: 'green', status: 'Out for Delivery' },
    { x: 55, y: 42, color: 'purple', status: 'Delayed' },
    { x: 60, y: 48, color: 'purple', status: 'Delayed' },
    { x: 30, y: 60, color: 'orange', status: 'At Origin' },
    { x: 50, y: 58, color: 'orange', status: 'At Origin' },
    { x: 40, y: 35, color: 'blue', status: 'In Transit' },
    { x: 65, y: 40, color: 'green', status: 'Out for Delivery' }
  ];

  ngOnInit(): void {}
}
'@ | Set-Content -Path "src\app\features\dashboard\dashboard.component.ts" -Encoding UTF8

Write-Host "dashboard.component.ts creado" -ForegroundColor Green

# ========== dashboard.component.html ==========
# (Contenido largo - se escribe en partes o se usa here-string)
$html = @'
<div class="flex h-screen bg-[#0b1220] text-slate-100 overflow-hidden">
  <!-- Sidebar -->
  <aside class="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col shrink-0">
    <div class="p-4 flex items-center gap-3 border-b border-slate-800">
      <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">NL</div>
      <span class="font-semibold text-lg">NexLog TMS</span>
    </div>
    <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-600 text-white font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
        Dashboard
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
        Shipments
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        Orders
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/></svg>
        Carriers
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        Rates & Contracts
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        Analytics
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        Exceptions
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        Documents
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        Settings
      </a>
    </nav>
    <div class="p-3 space-y-3 border-t border-slate-800">
      <div class="bg-slate-800/50 rounded-lg p-3 text-sm">
        <div class="flex items-center gap-2 text-green-400 mb-1">
          <div class="w-2 h-2 bg-green-400 rounded-full"></div>
          Network Status
        </div>
        <div class="text-slate-300">All Systems Operational</div>
        <div class="mt-2 h-8 bg-gradient-to-r from-green-500/20 to-transparent rounded"></div>
      </div>
      <div class="bg-slate-800/50 rounded-lg p-3 text-sm flex items-center gap-2 text-slate-300 hover:bg-slate-800 cursor-pointer">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        Need help? Contact Support
      </div>
    </div>
  </aside>

  <div class="flex-1 flex flex-col overflow-hidden">
    <header class="h-16 bg-[#0f172a] border-b border-slate-800 flex items-center px-6 gap-4 shrink-0">
      <button class="p-2 hover:bg-slate-800 rounded-lg">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <div class="flex-1 max-w-xl relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input type="text" placeholder="Search shipments, orders, carriers..." class="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-12 py-2 text-sm focus:outline-none focus:border-blue-500" />
        <kbd class="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-slate-700 px-1.5 py-0.5 rounded">⌘K</kbd>
      </div>
      <div class="flex items-center gap-3 ml-auto">
        <button class="relative p-2 hover:bg-slate-800 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button class="p-2 hover:bg-slate-800 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </button>
        <div class="flex items-center gap-2 pl-3 border-l border-slate-700">
          <div class="w-8 h-8 bg-slate-600 rounded-full"></div>
          <div class="text-sm">
            <div class="font-medium">Alex Morgan</div>
            <div class="text-xs text-slate-400">Operations Manager</div>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">Dashboard</h1>
          <p class="text-slate-400 text-sm">Real-time overview of your transportation network</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm hover:bg-slate-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            May 20 - May 26, 2024
          </button>
          <button class="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm hover:bg-slate-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
            Filters
          </button>
          <button class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            New Shipment
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        @for (kpi of kpis; track kpi.title) {
          <div class="bg-[#1e293b] rounded-xl p-4 border border-slate-800">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                     [class.bg-blue-500/20]="kpi.color === 'blue'"
                     [class.bg-green-500/20]="kpi.color === 'green'"
                     [class.bg-purple-500/20]="kpi.color === 'purple'"
                     [class.bg-orange-500/20]="kpi.color === 'orange'">
                  <svg class="w-5 h-5"
                       [class.text-blue-400]="kpi.color === 'blue'"
                       [class.text-green-400]="kpi.color === 'green'"
                       [class.text-purple-400]="kpi.color === 'purple'"
                       [class.text-orange-400]="kpi.color === 'orange'"
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    @if (kpi.icon === 'truck') {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
                    }
                    @if (kpi.icon === 'check') {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    }
                    @if (kpi.icon === 'dollar') {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    }
                    @if (kpi.icon === 'alert') {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    }
                  </svg>
                </div>
                <div>
                  <div class="text-xs text-slate-400">{{ kpi.title }}</div>
                  <div class="text-2xl font-bold mt-0.5">{{ kpi.value }}</div>
                </div>
              </div>
            </div>
            <div class="mt-3 flex items-center justify-between text-xs">
              <span [class.text-green-400]="kpi.changePositive" [class.text-red-400]="!kpi.changePositive">{{ kpi.change }}</span>
              <div class="w-16 h-6 bg-slate-800 rounded"></div>
            </div>
          </div>
        }
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="lg:col-span-2 bg-[#1e293b] rounded-xl p-4 border border-slate-800">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold">Weekly Volume</h3>
            <select class="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm">
              <option>Shipments</option>
            </select>
          </div>
          <div class="h-64">
            <canvas baseChart
                    [data]="weeklyVolumeData"
                    [options]="weeklyVolumeOptions"
                    [type]="weeklyVolumeType">
            </canvas>
          </div>
        </div>

        <div class="bg-[#1e293b] rounded-xl p-4 border border-slate-800">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold">Carrier Distribution</h3>
            <button class="text-slate-400 hover:text-white">•••</button>
          </div>
          <div class="flex items-center justify-center mb-4">
            <div class="relative w-40 h-40">
              <div class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-purple-500" style="clip-path: circle(50% at 50% 50%);"></div>
              <div class="absolute inset-4 bg-[#1e293b] rounded-full flex items-center justify-center flex-col">
                <div class="text-2xl font-bold">1,248</div>
                <div class="text-xs text-slate-400">Total</div>
              </div>
            </div>
          </div>
          <div class="space-y-2 text-sm">
            @for (carrier of carriers; track carrier.name) {
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full" [style.background]="carrier.color"></div>
                  <span>{{ carrier.name }}</span>
                </div>
                <span class="text-slate-400">{{ carrier.percentage }}%</span>
              </div>
            }
          </div>
          <a class="block text-center text-sm text-blue-400 mt-4 hover:underline">View all carriers →</a>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="lg:col-span-2 bg-[#1e293b] rounded-xl p-4 border border-slate-800">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold">Live Shipments Map</h3>
            <button class="text-slate-400 hover:text-white">•••</button>
          </div>
          <div class="relative h-72 bg-[#0f172a] rounded-lg overflow-hidden border border-slate-800">
            <svg viewBox="0 0 100 60" class="w-full h-full opacity-30">
              <path d="M10,30 L15,25 L25,28 L35,22 L45,25 L55,20 L65,22 L75,28 L80,35 L75,42 L65,45 L55,48 L45,45 L35,48 L25,42 L15,38 Z" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
            </svg>
            @for (marker of mapMarkers; track $index) {
              <div class="absolute w-3 h-3 rounded-full border-2 border-white shadow"
                   [style.left.%]="marker.x"
                   [style.top.%]="marker.y"
                   [class.bg-blue-500]="marker.color === 'blue'"
                   [class.bg-green-500]="marker.color === 'green'"
                   [class.bg-purple-500]="marker.color === 'purple'"
                   [class.bg-orange-500]="marker.color === 'orange'">
              </div>
            }
            <div class="absolute top-3 left-3 flex flex-col bg-slate-800 rounded">
              <button class="px-2 py-1 text-sm hover:bg-slate-700">+</button>
              <button class="px-2 py-1 text-sm hover:bg-slate-700 border-t border-slate-700">−</button>
            </div>
          </div>
          <div class="flex items-center justify-between mt-3 text-xs text-slate-400">
            <div class="flex gap-4">
              <span class="flex items-center gap-1"><span class="w-2 h-2 bg-blue-500 rounded-full"></span> In Transit 632</span>
              <span class="flex items-center gap-1"><span class="w-2 h-2 bg-green-500 rounded-full"></span> Out for Delivery 256</span>
              <span class="flex items-center gap-1"><span class="w-2 h-2 bg-orange-500 rounded-full"></span> At Origin 180</span>
              <span class="flex items-center gap-1"><span class="w-2 h-2 bg-purple-500 rounded-full"></span> Delayed 27</span>
            </div>
            <a class="text-blue-400 hover:underline">View full map →</a>
          </div>
        </div>

        <div class="bg-[#1e293b] rounded-xl p-4 border border-slate-800">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold">Recent Alerts</h3>
            <a class="text-sm text-blue-400 hover:underline">View all</a>
          </div>
          <div class="space-y-3">
            @for (alert of alerts; track alert.id) {
              <div class="flex gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                     [class.bg-red-500/20]="alert.color === 'red'"
                     [class.bg-orange-500/20]="alert.color === 'orange'"
                     [class.bg-yellow-500/20]="alert.color === 'yellow'"
                     [class.bg-blue-500/20]="alert.color === 'blue'">
                  <svg class="w-4 h-4"
                       [class.text-red-400]="alert.color === 'red'"
                       [class.text-orange-400]="alert.color === 'orange'"
                       [class.text-yellow-400]="alert.color === 'yellow'"
                       [class.text-blue-400]="alert.color === 'blue'"
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium truncate">{{ alert.title }}</div>
                  <div class="text-xs text-slate-400 truncate">{{ alert.description }}</div>
                </div>
                <div class="text-xs text-slate-500 shrink-0">{{ alert.time }}</div>
              </div>
            }
          </div>
          <a class="block text-center text-sm text-blue-400 mt-4 hover:underline">View all alerts →</a>
        </div>
      </div>
    </main>
  </div>
</div>
'@
$html | Set-Content -Path "src\app\features\dashboard\dashboard.component.html" -Encoding UTF8
Write-Host "dashboard.component.html creado" -ForegroundColor Green

# ========== dashboard.component.scss ==========
@'
:host {
  display: block;
  height: 100%;
}
'@ | Set-Content -Path "src\app\features\dashboard\dashboard.component.scss" -Encoding UTF8

# ========== app.component.ts ==========
@'
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent],
  template: `
    <app-dashboard></app-dashboard>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {}
'@ | Set-Content -Path "src\app\app.component.ts" -Encoding UTF8

# ========== app.config.ts ==========
@'
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideCharts(withDefaultRegisterables())
  ]
};
'@ | Set-Content -Path "src\app\app.config.ts" -Encoding UTF8

# ========== app.routes.ts ==========
@'
import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '' }
];
'@ | Set-Content -Path "src\app\app.routes.ts" -Encoding UTF8

Write-Host "`n=== Archivos del Dashboard creados correctamente ===" -ForegroundColor Cyan
Write-Host "Ahora ejecuta: ng serve" -ForegroundColor Yellow
