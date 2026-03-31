export declare function getFlaggedQuestionIds(userId: number): Promise<number[]>;
export declare function getFlagStatus(userId: number, questionId: number): Promise<{
    flagged: boolean;
}>;
export declare function toggleFlag(userId: number, questionId: number): Promise<{
    flagged: boolean;
}>;
export declare function getQuestionById(id: number): Promise<({
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
//# sourceMappingURL=questionFlags.service.d.ts.map