import { useQuery } from "@tanstack/react-query";

import { analyticsService } from "../services/analyticsService";

import type { TimeRange } from "@/shared/types/common.types";

const LIVE_REFETCH = 1_000;

const TREND_REFETCH = 5_000;

const liveQueryOptions = {
    staleTime: 0,

    refetchInterval: LIVE_REFETCH,

    refetchOnWindowFocus: false,
};

export const useAnalyticsOverview = () =>
    useQuery({
        queryKey: ["analytics", "overview"],

        queryFn: () => analyticsService.getOverview(),

        ...liveQueryOptions,
    });

export const useAnalyticsTrend = (range: TimeRange) =>
    useQuery({
        queryKey: ["analytics", "trend", range],

        queryFn: () => analyticsService.getTrendData(range),

        staleTime: 0,

        refetchInterval: TREND_REFETCH,

        refetchOnWindowFocus: false,
    });

export const useRiskItems = () =>
    useQuery({
        queryKey: ["analytics", "risk"],

        queryFn: () => analyticsService.getRiskItems(),

        ...liveQueryOptions,
    });

export const useAnomalyEvents = () =>
    useQuery({
        queryKey: ["analytics", "anomalies"],

        queryFn: () => analyticsService.getAnomalyEvents(),

        staleTime: 0,

        refetchInterval: TREND_REFETCH,

        refetchOnWindowFocus: false,
    });

export const useBehaviorMetrics = () =>
    useQuery({
        queryKey: ["analytics", "behavior"],

        queryFn: () => analyticsService.getBehaviorMetrics(),

        ...liveQueryOptions,
    });

export const useRecommendations = () =>
    useQuery({
        queryKey: ["analytics", "recommendations"],

        queryFn: () => analyticsService.getRecommendations(),

        ...liveQueryOptions,
    });
