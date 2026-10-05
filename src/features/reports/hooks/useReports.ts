import { useQuery } from '@tanstack/react-query'
import { reportService } from "../services/reportService";

export const useReports = () =>
  useQuery({
    queryKey: ['reports'],
    queryFn: () => reportService.getReports(),
    staleTime: 30_000,
  })

export const useMaintenanceSchedules = () =>
  useQuery({
    queryKey: ['reports', 'maintenance'],
    queryFn: () => reportService.getMaintenanceSchedules(),
    staleTime: 30_000,
  })

export const useMonthlyTrend = () =>
  useQuery({
    queryKey: ['reports', 'trend'],
    queryFn: () => reportService.getMonthlyTrend(),
    staleTime: 30_000,
  })

export const useReportStats = () =>
  useQuery({
    queryKey: ['reports', 'stats'],
    queryFn: () => reportService.getReportStats(),
    staleTime: 30_000,
  })