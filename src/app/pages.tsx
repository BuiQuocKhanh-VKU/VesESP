import { useState } from 'react'
import {
  SystemOverviewBar, EngineHealthOverview,
  TrendAnalysisChart, SystemFlowDiagram, RecommendedActions,
} from '@/features/dashboard'
import {
  AlertCenterBar, ActiveAlertList, AlertDetailPanel,
  AlertSeverityChart, AlertTrendChart, AlertHistoryTable,
} from '@/features/alerts'
import {
  AnalyticsOverviewBar, MultiParamTrendChart, PredictiveRiskPanel,
  AnomalyDetection, BehaviorComparison, AnalyticsRecommendations,
} from '@/features/analytics'
import {
  ReportHeaderBar, ReportLibraryTable, MaintenanceSchedule,
  MonthlyTrendChart, ReportPreviewPanel,
} from '@/features/reports'
import {
  SettingsHeaderBar, DeviceConfiguration, AlertThresholds,
  NotificationSettings, AccessControl, SystemPreferencesPanel, SystemActions,
} from '@/features/settings'
import { useAlertStore } from '@/store/useAlertStore'

export const DashboardPage = () => (
  <div className="flex flex-col gap-4">
    <SystemOverviewBar />
    <EngineHealthOverview />
    <TrendAnalysisChart />
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2"><SystemFlowDiagram /></div>
      <div className="col-span-1"><RecommendedActions /></div>
    </div>
  </div>
)

export const AlertsPage = () => {
  const { selectedAlertId, setSelectedAlertId } = useAlertStore()

  return (
    <div className="flex flex-col gap-4">
      <AlertCenterBar />
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <ActiveAlertList selectedId={selectedAlertId} onSelect={setSelectedAlertId} />
        </div>
        <div className="col-span-1 rounded-xl border border-[var(--bg-border)] bg-[var(--bg-card)] p-4">
          <AlertDetailPanel alertId={selectedAlertId} />
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <AlertSeverityChart />
          <AlertTrendChart />
        </div>
      </div>
      <AlertHistoryTable />
    </div>
  )
}

export const AnalyticsPage = () => (
  <div className="flex flex-col gap-4">
    <AnalyticsOverviewBar />
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2"><MultiParamTrendChart /></div>
      <div className="col-span-1"><PredictiveRiskPanel /></div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1"><AnomalyDetection /></div>
      <div className="col-span-1"><BehaviorComparison /></div>
      <div className="col-span-1"><AnalyticsRecommendations /></div>
    </div>
  </div>
)

export const ReportsPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <ReportHeaderBar />
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <ReportLibraryTable selectedId={selectedId} onSelect={setSelectedId} />
        </div>
        <div className="col-span-1">
          <MaintenanceSchedule />
        </div>
      </div>
      <MonthlyTrendChart />
      <ReportPreviewPanel selectedId={selectedId} />
    </div>
  )
}

export const SettingsPage = () => (
  <div className="flex flex-col gap-4">
    <SettingsHeaderBar />

    <div className="grid grid-cols-3 gap-4 items-stretch">
      <div className="col-span-1 flex flex-col">
        <DeviceConfiguration />
      </div>
      <div className="col-span-1 flex flex-col">
        <AlertThresholds />
      </div>
      <div className="col-span-1 flex flex-col gap-4">
        <NotificationSettings />
        <SystemActions />
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4 items-stretch">
      <div className="col-span-1 flex flex-col">
        <AccessControl />
      </div>
      <div className="col-span-2 flex flex-col">
        <SystemPreferencesPanel />
      </div>
    </div>

    <div className="flex justify-end gap-3 pb-2">
      <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--bg-border)] text-[11px] font-semibold text-[var(--text-secondary)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] transition-all">
        ↺ Reset Defaults
      </button>
      <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent-cyan)] text-[var(--bg-base)] text-[11px] font-bold hover:opacity-90 transition-opacity">
        ✓ Save Changes
      </button>
    </div>
  </div>
)