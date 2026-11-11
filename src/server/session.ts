// Không có auth thật nên mặc định người dùng là S01. Danh tính xác định ngay đây mà không nhận từ url
export type Session = {
    studentId: string;
};

export function getCurrentSession(): Session {
    return { studentId: "S01" };
}