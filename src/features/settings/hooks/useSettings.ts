import { useQuery } from '@tanstack/react-query'
import { settingsService } from '../services/settingsService';

export const useDeviceConfig = () =>
  useQuery({
    queryKey: ['settings', 'device'],
    queryFn: () => settingsService.getDeviceConfig(),
    staleTime: 60_000,
  })

export const useThresholdConfig = () =>
  useQuery({
    queryKey: ['settings', 'thresholds'],
    queryFn: () => settingsService.getThresholdConfig(),
    staleTime: 60_000,
  })

export const useNotificationConfig = () =>
  useQuery({
    queryKey: ['settings', 'notifications'],
    queryFn: () => settingsService.getNotificationConfig(),
    staleTime: 60_000,
  })

export const useUserRoles = () =>
  useQuery({
    queryKey: ['settings', 'users'],
    queryFn: () => settingsService.getUserRoles(),
    staleTime: 60_000,
  })

export const useSystemPreferences = () =>
  useQuery({
    queryKey: ['settings', 'preferences'],
    queryFn: () => settingsService.getSystemPreferences(),
    staleTime: 60_000,
  })