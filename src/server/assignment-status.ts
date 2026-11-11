import type { Assignment } from "./assignments";

export type MainStatus = "submitted" | "not_submitted" | "overdue";

export type AssignmentStatus = {
    status: MainStatus;
    isLate: boolean;
}

// hạn 23:59 thì tính trọn vẹn phút đó: đúng hạn < 00:00:00 hôm sau
const ONE_MINUTE_MS = 60 * 1000;

export function getAssignmentStatus(
    assignment: Pick<Assignment, "dueAt" | "submittedAt">,
    now: Date,
): AssignmentStatus {
    const deadlineEnd = new Date(assignment.dueAt).getTime() + ONE_MINUTE_MS;
    const nowMs = now.getTime();
    const submittedMs = assignment.submittedAt === null ? null : new Date(assignment.submittedAt).getTime();

    // sau now => chưa nộp
    if (submittedMs !== null && submittedMs <= nowMs) {
        return { status: "submitted", isLate: submittedMs >= deadlineEnd };
    }

    if (nowMs >= deadlineEnd) {
        return { status: "overdue", isLate: false };
    }
    return { status: "not_submitted", isLate: false };
}