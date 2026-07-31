import { DashboardService } from "./mock/dashboardService";
import { AlertService } from "./mock/alertService";
import { AnalyticsService } from "./mock/analyticsService";
import { ReportService } from "./mock/reportService";
import { SettingsService } from "./mock/settingsService";

export const dashboardService = new DashboardService();
export const alertService = new AlertService();
export const analyticsService = new AnalyticsService();
export const reportService = new ReportService();
export const settingsService = new SettingsService();
