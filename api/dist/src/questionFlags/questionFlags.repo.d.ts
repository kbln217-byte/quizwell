export declare function findFlaggedQuestionIdsByUserId(userId: number): Promise<number[]>;
export declare function findFlag(userId: number, questionId: number): Promise<{
    id: number;
    userId: number;
    questionId: number;
    createdAt: Date;
} | null>;
export declare function createFlag(userId: number, questionId: number): Promise<{
    id: number;
    userId: number;
    questionId: number;
    createdAt: Date;
}>;
export declare function deleteFlag(userId: number, questionId: number): Promise<{
    id: number;
    userId: number;
    questionId: number;
    createdAt: Date;
}>;
export declare function findByIdQuestion(id: number): Promise<({
    examSession: {
        id: number;
        examYear: number;
        examRound: number;
        examDate: Date | null;
        title: string | null;
        status: boolean;
    };
    choices: {
        id: number;
        isCorrect: boolean;
        questionId: number;
        label: string;
        text: string;
    }[];
} & {
    id: number;
    examSessionId: number;
    questionNumber: number;
    body: string;
    explanation: string | null;
}) | null>;
//# sourceMappingURL=questionFlags.repo.d.ts.map