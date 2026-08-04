import { useEffect, useState } from "react";
import { Thermometer, Activity, Droplets, RefreshCw } from "lucide-react";

import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Sparkline } from "@/shared/components/ui/Sparkline";
import { SyncButton } from "@/shared/components/ui/SyncButton";

import { useEngineHealth } from "../hooks/useEngineHealth";
import { useTranslation } from "@/shared/hooks/useTranslation";

import type { SensorCard } from "@/shared/types/sensor.types";

const iconMap: Record<string, React.ElementType> = {
    temperature: Thermometer,
    vibration: Activity,
    humidity: Droplets,
};

const colorMap: Record<string, string> = {
    temperature: "var(--accent-cyan)",
    vibration: "var(--status-warn)",
    humidity: "var(--status-ok)",
};

const formatElapsedTime = (seconds: number, language: "en" | "vi") => {
    if (seconds < 60) {
        return language === "vi"
            ? `${seconds} giây trước`
            : `${seconds} seconds ago`;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return language === "vi"
            ? `${minutes} phút trước`
            : `${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);

    return language === "vi" ? `${hours} giờ trước` : `${hours} hours ago`;
};

const SensorCardItem = ({
    card,
    language,
    t,
}: {
    card: SensorCard;
    language: "en" | "vi";
    t: ReturnType<typeof useTranslation>["t"];
}) => {
    const Icon = iconMap[card.id] ?? Activity;
    const color = colorMap[card.id] ?? "var(--accent-cyan)";

    return (
        <Card className="flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2">
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${color}22` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                </div>

                <span className="text-[11px] text-[var(--text-secondary)] font-medium">
                    {card.label[language]}
                </span>
            </div>

            <div className="flex items-end justify-between">
                <div>
                    <span className="text-2xl font-bold font-mono text-[var(--text-primary)]">
                        {card.value}
                    </span>

                    <span className="text-xs text-[var(--text-muted)] ml-1">
                        {card.unit}
                    </span>

                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                        {t.dashboard.normalRange}: {card.normalMin} –{" "}
                        {card.normalMax} {card.unit}
                    </p>
                </div>

                <div className="w-20">
                    <Sparkline
                        data={card.sparkline}
                        color={color}
                        height={36}
                    />
                </div>
            </div>

            <Badge
                label={
                    card.isWithinRange
                        ? t.dashboard.withinRange
                        : t.dashboard.outOfRange
                }
                variant={card.isWithinRange ? "ok" : "danger"}
            />
        </Card>
    );
};

const LastSyncCard = ({
    t,
    language,
    lastSync,
    secondsSinceSync,
    onSynced,
}: {
    t: ReturnType<typeof useTranslation>["t"];
    language: "en" | "vi";
    lastSync: Date;
    secondsSinceSync: number;
    onSynced: (time: Date) => void;
}) => {
    const timeString = lastSync.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    const dateString = lastSync.toLocaleDateString("vi-VN");

    return (
        <Card className="flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--accent-cyan)22]">
                    <RefreshCw className="w-4 h-4 text-[var(--accent-cyan)]" />
                </div>

                <span className="text-[11px] text-[var(--text-secondary)] font-medium">
                    {t.system.lastSync}
                </span>
            </div>

            <div>
                <span className="text-2xl font-bold font-mono text-[var(--text-primary)]">
                    {timeString}
                </span>

                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                    {dateString}
                </p>

                <p className="text-[10px] text-[var(--accent-cyan)] mt-1">
                    {formatElapsedTime(secondsSinceSync, language)}
                </p>
            </div>

            <SyncButton onSynced={onSynced} />
        </Card>
    );
};

export const EngineHealthOverview = () => {
    const { data: cards, isLoading } = useEngineHealth();
    const { t, language } = useTranslation();

    const [lastSync, setLastSync] = useState(new Date());
    const [secondsSinceSync, setSecondsSinceSync] = useState(0);

    useEffect(() => {
        const timer = window.setInterval(() => {
            const elapsed = Math.floor(
                (Date.now() - lastSync.getTime()) / 1000,
            );

            setSecondsSinceSync(elapsed);
        }, 1000);

        return () => window.clearInterval(timer);
    }, [lastSync]);

    const handleSynced = (time: Date) => {
        setLastSync(time);
        setSecondsSinceSync(0);
    };

    if (isLoading) {
        return (
            <div className="flex gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex-1 h-32 rounded-xl bg-[var(--bg-card)] animate-pulse"
                    />
                ))}
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-3">
                {t.dashboard.engineHealth}
            </h2>

            <div className="flex gap-3">
                {cards?.map((card) => (
                    <SensorCardItem
                        key={card.id}
                        card={card}
                        language={language}
                        t={t}
                    />
                ))}

                <LastSyncCard
                    t={t}
                    language={language}
                    lastSync={lastSync}
                    secondsSinceSync={secondsSinceSync}
                    onSynced={handleSynced}
                />
            </div>
        </div>
    );
};
