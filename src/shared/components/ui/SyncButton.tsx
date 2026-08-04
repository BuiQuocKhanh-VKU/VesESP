import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface SyncButtonProps {
    onSynced?: (time: Date) => void;
}

export const SyncButton = ({ onSynced }: SyncButtonProps) => {
    const queryClient = useQueryClient();
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        try {
            setIsSyncing(true);

            await queryClient.invalidateQueries({
                queryKey: ["dashboard"],
            });

            await queryClient.invalidateQueries({
                queryKey: ["analytics"],
            });

            await queryClient.refetchQueries({
                type: "active",
            });

            onSynced?.(new Date());
        } catch (error) {
            console.error("Đồng bộ dữ liệu thất bại:", error);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="
                flex items-center justify-center gap-2
                w-full rounded-full border
                border-[var(--accent-cyan)]
                px-3 py-1.5
                text-[10px] font-semibold
                text-[var(--accent-cyan)]
                transition-all
                hover:bg-[var(--accent-cyan)]
                hover:text-[var(--bg-base)]
                disabled:cursor-not-allowed
                disabled:opacity-60
            ">
            <RefreshCw
                className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`}
            />

            {isSyncing ? "Đang đồng bộ..." : "Đồng bộ ngay"}
        </button>
    );
};
