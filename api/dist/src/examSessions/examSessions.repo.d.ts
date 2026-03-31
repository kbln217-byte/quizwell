export declare function findAllSessions(): Promise<{
    id: number;
    examYear: number;
    examRound: number;
    examDate: Date | null;
    title: string | null;
    status: boolean;
}[]>;
export declare function findByIdSession(id: number): Promise<{
    id: number;
    examYear: number;
    examRound: number;
    examDate: Date | null;
    title: string | null;
    status: boolean;
} | null>;
//# sourceMappingURL=examSessions.repo.d.ts.map