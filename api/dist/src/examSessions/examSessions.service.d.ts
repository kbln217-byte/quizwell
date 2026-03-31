export type JwtPayload = {
    sub: number;
};
export declare class HttpError extends Error {
    status: number;
    code: string;
    constructor(status: number, code: string, message: string);
}
export declare function getAllSessions(): Promise<{
    id: number;
    examYear: number;
    examRound: number;
    examDate: Date | null;
    title: string | null;
    status: boolean;
}[]>;
export declare function getSessionById(id: number): Promise<{
    id: number;
    examYear: number;
    examRound: number;
    examDate: Date | null;
    title: string | null;
    status: boolean;
}>;
//# sourceMappingURL=examSessions.service.d.ts.map