import { useQuery } from '@tanstack/react-query'
import { alertService } from '@/services'

export const useAlerts = () =>
  useQuery({
    queryKey: ['alerts'],
    queryFn: () => alertService.getAlerts(),
    staleTime: 30_000,
  })

export const useAlertSummary = () =>
  useQuery({
    queryKey: ['alerts', 'summary'],
    queryFn: () => alertService.getAlertSummary(),
    staleTime: 30_000,
  })

export const useAlertHistory = () =>
  useQuery({
    queryKey: ['alerts', 'history'],
    queryFn: () => alertService.getAlertHistory(),
    staleTime: 30_000,
  })