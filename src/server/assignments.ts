export type Assignment = {
    id: string;
    studentId: string;
    title: string;
    dueAt: string;
    submittedAt: string | null; // null => chưa nộp
};

export const assignments: Assignment[] = [
    {
        id: "A01",
        studentId: "S01",
        title: "Foundation U1 - Reading",
        dueAt: "2026-11-13T23:59:00+07:00",
        submittedAt: null,
    },
    {
        id: "A02",
        studentId: "S01",
        title: "Foundation U2 - Listening",
        dueAt: "2026-11-09T23:59:00+07:00",
        submittedAt: null,
    },
    {
        id: "A03",
        studentId: "S01",
        title: "Foundation U3 - Writing",
        dueAt: "2026-11-10T23:59:00+07:00",
        submittedAt: "2026-11-10T20:00:00+07:00",
    },
    {
        id: "A04",
        studentId: "S01",
        title: "Foundation U4 - Speaking",
        dueAt: "2026-11-08T23:59:00+07:00",
        submittedAt: "2026-11-10T12:00:00+07:00",
    },
    {
        id: "B01",
        studentId: "S02",
        title: "Foundation U1 - Reading",
        dueAt: "2026-11-13T23:59:00+07:00",
        submittedAt: null,
    },
]
