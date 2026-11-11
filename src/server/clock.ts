// "Bây giờ" của hệ thống, cố định theo đề: 11/11/2026 09:00 (GMT+7). Sửa dòng này để demo
const FIXED_NOW = "2026-11-11T09:00:00+07:00";

export function getNow(): Date {
    return new Date(FIXED_NOW);
}