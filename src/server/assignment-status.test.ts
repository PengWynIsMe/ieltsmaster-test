import { describe, expect, it } from "vitest";
import { getAssignmentStatus } from "./assignment-status";

// Cố định theo đề bài
const NOW = new Date("2026-11-11T09:00:00+07:00");
const DUE = "2026-11-10T23:59:00+07:00";

describe("getAssignmentStatus — 4 ca của đề (now = 11/11/2026 09:00 +07:00)", () => {
    it("A01: chưa nộp, chưa tới hạn → Chưa nộp", () => {
        expect(
            getAssignmentStatus({ dueAt: "2026-11-13T23:59:00+07:00", submittedAt: null }, NOW),
        ).toEqual({ status: "not_submitted", isLate: false });
    });

    it("A02: chưa nộp, đã qua hạn → Quá hạn", () => {
        expect(
            getAssignmentStatus({ dueAt: "2026-11-09T23:59:00+07:00", submittedAt: null }, NOW),
        ).toEqual({ status: "overdue", isLate: false });
    });

    it("A03: nộp trước hạn → Đã nộp", () => {
        expect(
            getAssignmentStatus(
                { dueAt: "2026-11-10T23:59:00+07:00", submittedAt: "2026-11-10T20:00:00+07:00" },
                NOW,
            ),
        ).toEqual({ status: "submitted", isLate: false });
    });

    it("A04: nộp sau hạn → Đã nộp + Nộp trễ", () => {
        expect(
            getAssignmentStatus(
                { dueAt: "2026-11-08T23:59:00+07:00", submittedAt: "2026-11-10T12:00:00+07:00" },
                NOW,
            ),
        ).toEqual({ status: "submitted", isLate: true });
    });
});

describe("getAssignmentStatus — ca biên quanh hạn 23:59", () => {
    it("nộp lúc 23:59:59 ngày hạn → đúng hạn", () => {
        expect(
            getAssignmentStatus({ dueAt: DUE, submittedAt: "2026-11-10T23:59:59+07:00" }, NOW),
        ).toEqual({ status: "submitted", isLate: false });
    });

    it("nộp lúc 00:00:00 hôm sau → trễ", () => {
        expect(
            getAssignmentStatus({ dueAt: DUE, submittedAt: "2026-11-11T00:00:00+07:00" }, NOW),
        ).toEqual({ status: "submitted", isLate: true });
    });

    it("chưa nộp, now = 23:59:30 ngày hạn → chưa quá hạn", () => {
        expect(
            getAssignmentStatus({ dueAt: DUE, submittedAt: null }, new Date("2026-11-10T23:59:30+07:00")),
        ).toEqual({ status: "not_submitted", isLate: false });
    });

    it("chưa nộp, now = 00:00:00 hôm sau → quá hạn", () => {
        expect(
            getAssignmentStatus({ dueAt: DUE, submittedAt: null }, new Date("2026-11-11T00:00:00+07:00")),
        ).toEqual({ status: "overdue", isLate: false });
    });
});

describe("getAssignmentStatus — giờ nộp so với now", () => {
    it("nộp đúng bằng now → Đã nộp", () => {
        expect(
            getAssignmentStatus(
                { dueAt: "2026-11-13T23:59:00+07:00", submittedAt: "2026-11-11T09:00:00+07:00" },
                NOW,
            ),
        ).toEqual({ status: "submitted", isLate: false });
    });

    it("thay đổi now trước giờ nộp → tại now coi như chưa nộp", () => {
        const now = new Date("2026-11-09T12:00:00+07:00"); // dời now về TRƯỚC lúc nộp (10/11 20:00)
        expect(
            getAssignmentStatus({ dueAt: DUE, submittedAt: "2026-11-10T20:00:00+07:00" }, now),
        ).toEqual({ status: "not_submitted", isLate: false });
    });

    it("now sau giờ nộp → đã nộp", () => {
        const now = new Date("2026-11-11T12:00:00+07:00"); // dời now về Sau lúc nộp (10/11 20:00)
        expect(
            getAssignmentStatus({ dueAt: DUE, submittedAt: "2026-11-10T20:00:00+07:00" }, now),
        ).toEqual({ status: "submitted", isLate: false });
    });
});