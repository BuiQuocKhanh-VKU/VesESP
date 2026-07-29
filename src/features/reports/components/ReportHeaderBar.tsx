import { FileText, Wrench, Ship, Clock } from "lucide-react";
import { useReports } from "../hooks/useReports";
import { useSystemStore } from "@/store/useSystemStore";
import { useUTCClock } from "@/shared/hooks/useUTCClock";
import { useTranslation } from "@/shared/hooks/useTranslation";

export const ReportHeaderBar = () => {
    const { data: reports } = useReports();
    const vessel = useSystemStore((s) => s.vessel);
    const { timeString, dateString } = useUTCClock();

    const { t } = useTranslation();

    return (
        <div className="flex items-center gap-4 px-5 py-3 rounded-xl border border-[var(--bg-border)] bg-[var(--bg-card)]">
            {/* Title */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-cyan)] bg-opacity-20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[var(--accent-cyan)]" />
                </div>
                <div>
                    <p className="text-xs font-bold text-[var(--text-primary)] tracking-wide">
                        {t.reports.title}
                    </p>
                    <p className="text-[9px] text-[var(--text-muted)]">
                        Document management system
                    </p>
                </div>
            </div>

            <div className="w-px h-10 bg-[var(--bg-border)]" />

            {/* Total Reports */}
            <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                    {t.reports.totalReports}
                </p>
                <p className="text-xl font-bold font-mono text-[var(--text-primary)]">
                    {reports?.length ?? 128}
                </p>
            </div>

            <div className="w-px h-10 bg-[var(--bg-border)]" />

            {/* Latest Report */}
            <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                    {t.reports.latestReport}
                </p>
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                    {reports?.[0]?.dateGenerated ?? "May 27, 2024 14:15"} UTC
                </p>
            </div>

            <div className="w-px h-10 bg-[var(--bg-border)]" />

            {/* Maintenance */}
            <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[var(--text-muted)]" />
                <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                        {t.reports.maintenance}
                    </p>
                    <p className="text-xl font-bold font-mono text-[var(--text-primary)]">
                        23
                    </p>
                </div>
            </div>

            {/* Right side */}
            <div className="ml-auto flex items-center gap-4">
                <div className="w-px h-10 bg-[var(--bg-border)]" />
                <div className="flex items-center gap-2">
                    <Ship className="w-4 h-4 text-[var(--text-muted)]" />
                    <div>
                        <p className="text-[10px] text-[var(--text-muted)]">
                            {t.system.vessel}
                        </p>
                        <p className="text-xs font-semibold text-[var(--text-primary)]">
                            {vessel.name}
                        </p>
                    </div>
                </div>
                <div className="w-px h-10 bg-[var(--bg-border)]" />
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                    <div>
                        <p className="text-[10px] text-[var(--text-muted)]">
                            {t.system.utc}
                        </p>
                        <p className="text-sm font-bold font-mono text-[var(--accent-cyan)]">
                            {timeString}
                        </p>
                        <p className="text-[9px] text-[var(--text-muted)]">
                            {dateString}
                        </p>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="w-px h-10 bg-[var(--bg-border)]" />
                <div className="flex items-center gap-2">
                    {[
                        t.reports.generateReport,
                        t.reports.exportPdf,
                        t.reports.share,
                    ].map((label, i) => (
                        <button
                            key={label}
                            className={[
                                "px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all",
                                i === 0
                                    ? "bg-[var(--accent-cyan)] text-[var(--bg-base)] hover:opacity-90"
                                    : "border border-[var(--bg-border)] text-[var(--text-secondary)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)]",
                            ].join(" ")}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
