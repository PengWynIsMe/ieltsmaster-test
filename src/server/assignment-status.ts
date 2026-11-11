import type { Assignment } from "./assignments";

export type MainStatus = "submitted" | "not-submitted" | "overdue";

export type AssignmentStatus = {
    status: MainStatus;
    isLate: boolean;
}

const ONE_MINUTE_MS = 60 * 1000;

export function getAssignmentStatus(
    assignment: Pick<Assignment, "dueAt" | "submittedAt">,
    now: Date,
): AssignmentStatus {
    const deadlineEnd = new Date(assignment.dueAt).getTime() + ONE_MINUTE_MS;
    const nowMs = now.getTime();
    const submittedMs = assignment.submittedAt === null ? null : new Date(assignment.submittedAt).getTime();

    if (submittedMs !== null && submittedMs <= nowMs) {
        return { status: "submitted", isLate: submittedMs >= deadlineEnd };
    }

    if (nowMs >= deadlineEnd) {
        return { status: "overdue", isLate: false };
    }
    return { status: "not-submitted", isLate: false };
}