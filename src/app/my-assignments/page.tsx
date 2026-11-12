"use client";

import { useEffect, useState } from "react";
import type { MainStatus } from "@/server/assignment-status";

type MyAssignment = {
    id: string;
    title: string;
    dueAt: string;
    submittedAt: string | null;
    status: MainStatus;
    isLate: boolean;
};

type LoadState =
    | { kind: "loading" }
    | { kind: "error" }
    | { kind: "ready"; assignments: MyAssignment[] }; // rỗng = ready + mảng 0 phần tử

const STATUS_LABELS: Record<MainStatus, string> = {
    submitted: "Đã nộp",
    overdue: "Quá hạn",
    not_submitted: "Chưa nộp",
};

const STATUS_STYLES: Record<MainStatus, string> = {
    submitted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    not_submitted: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
};

const dateTimeFormat = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});

function formatDateTime(iso: string) {
    return dateTimeFormat.format(new Date(iso));
}

export default function MyAssignmentsPage() {
    const [state, setState] = useState<LoadState>({ kind: "loading" });

    useEffect(() => {
        const controller = new AbortController();

        const simulate = new URLSearchParams(window.location.search).get("simulate");
        const url = simulate
            ? `/api/my-assignments?simulate=${encodeURIComponent(simulate)}`
            : "/api/my-assignments";

        fetch(url, { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data: { assignments: MyAssignment[] }) => {
                setState({ kind: "ready", assignments: data.assignments });
            })
            .catch(() => {
                if (!controller.signal.aborted) setState({ kind: "error" });
            });

        return () => controller.abort();
    }, []);

    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold">Bài tập của tôi</h1>

            {state.kind === "loading" && <p className="text-gray-500 dark:text-gray-400">Đang tải…</p>}

            {state.kind === "error" && (
                <p role="alert" className="rounded-md bg-red-50 p-4 text-red-800 dark:bg-red-950 dark:text-red-200">
                    Không tải được danh sách bài tập. Vui lòng thử lại sau.
                </p>
            )}

            {state.kind === "ready" && state.assignments.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400">Bạn chưa có bài tập nào.</p>
            )}

            {state.kind === "ready" && state.assignments.length > 0 && (
                <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
                    {state.assignments.map((a) => (
                        <li
                            key={a.id}
                            className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <p className="font-medium">{a.title}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Hạn nộp: {formatDateTime(a.dueAt)}
                                </p>
                                {a.status === "submitted" && a.submittedAt && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Nộp lúc: {formatDateTime(a.submittedAt)}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <span
                                    className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLES[a.status]}`}
                                >
                                    {STATUS_LABELS[a.status]}
                                </span>
                                {a.isLate && (
                                    <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                                        Nộp trễ
                                    </span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
