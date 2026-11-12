import { assignments } from "@/server/assignments";
import { getAssignmentStatus } from "@/server/assignment-status";
import { getNow } from "@/server/clock";
import { getCurrentSession } from "@/server/session";

// GET /api/my-assignments — bài tập của học viên đang đăng nhập. (hiện tại là cho S01, bỏ qua S02)
export function GET(request: Request) {
    // Thử trạng thái lỗi / rỗng trên UI: ?simulate=error/empty
    const simulate = new URL(request.url).searchParams.get("simulate");
    if (simulate === "error") {
        return Response.json({ message: "Lỗi giả lập" }, { status: 500 });
    }
    if (simulate === "empty") {
        return Response.json({ assignments: [] });
    }

    const { studentId } = getCurrentSession();
    const now = getNow();

    const items = assignments
        .filter((a) => a.studentId === studentId)
        .map((a) => ({
            id: a.id,
            title: a.title,
            dueAt: a.dueAt,
            submittedAt: a.submittedAt,
            ...getAssignmentStatus(a, now),
        }));

    return Response.json({ assignments: items });
}