import { useQuery } from "@tanstack/react-query";

import { alertService } from "../services/alertService";

export const useAlerts = () =>
    useQuery({
        queryKey: ["alerts"],
        queryFn: () => alertService.getAlerts(),
    });

export const useAlert = (id: string) =>
    useQuery({
        queryKey: ["alerts", id],

        queryFn: () => alertService.getAlertById(id),

        enabled: Boolean(id),
    });

export const useAlertSummary = () =>
    useQuery({
        queryKey: ["alerts", "summary"],

        queryFn: () => alertService.getAlertSummary(),
    });

export const useAlertHistory = () =>
    useQuery({
        queryKey: ["alerts", "history"],

        queryFn: () => alertService.getAlertHistory(),
    });
