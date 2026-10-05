import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "../services/dashboardService";

const DASHBOARD_REFETCH = 1_000;

export const useEngineHealth = () => {
    return useQuery({
        queryKey: ["dashboard", "sensorCards"],
        queryFn: () => dashboardService.getSensorCards(),

        staleTime: 0,
        refetchInterval: DASHBOARD_REFETCH,
        refetchOnWindowFocus: false,
    });
};

export const useSystemEvents = () => {
    return useQuery({
        queryKey: ["dashboard", "systemEvents"],
        queryFn: () => dashboardService.getSystemEvents(),

        staleTime: 30_000,
        refetchOnWindowFocus: false,
    });
};
