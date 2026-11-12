import { describe, expect, it } from "vitest";
import { GET } from "./route";

const BASE = "http://localhost/api/my-assignments";

async function callApi(query = "") {
    const res = GET(new Request(BASE + query));
    return { status: res.status, body: await res.json() };
}

describe("GET /api/my-assignments", () => {
    it("chỉ trả bài của S01 (A01–A04), không có B01", async () => {
        const { status, body } = await callApi();
        expect(status).toBe(200);
        const ids = body.assignments.map((a: { id: string }) => a.id);
        expect(ids).toEqual(["A01", "A02", "A03", "A04"]);
        expect(ids).not.toContain("B01");
    });

    it("bỏ qua ?studentId=S02 — vẫn chỉ trả bài của S01", async () => {
        // Thử IDOR
        const { body } = await callApi("?studentId=S02");
        const ids = body.assignments.map((a: { id: string }) => a.id);
        expect(ids).toEqual(["A01", "A02", "A03", "A04"]);
    });

    it("không trả về studentId", async () => {
        const { body } = await callApi();
        for (const a of body.assignments) {
            expect(a).not.toHaveProperty("studentId");
        }
    });

    it("tính đúng trạng thái với now cố định", async () => {
        const { body } = await callApi();
        const summary = body.assignments.map(
            (a: { id: string; status: string; isLate: boolean }) => [a.id, a.status, a.isLate],
        );
        expect(summary).toEqual([
            ["A01", "not_submitted", false],
            ["A02", "overdue", false],
            ["A03", "submitted", false],
            ["A04", "submitted", true],
        ]);
    });

    it("?simulate=error → 500", async () => {
        const { status } = await callApi("?simulate=error");
        expect(status).toBe(500);
    });

    it("?simulate=empty → danh sách rỗng", async () => {
        const { body } = await callApi("?simulate=empty");
        expect(body.assignments).toEqual([]);
    });
});