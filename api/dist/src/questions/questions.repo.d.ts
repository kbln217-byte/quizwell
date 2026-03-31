export declare function findAllQuestions(): Promise<{
    id: number;
    examSessionId: number;
    questionNumber: number;
    body: string;
    explanation: string | null;
}[]>;
export declare function findByIdQuestion(id: number, userId: number): Promise<{
    flagged: boolean;
    flags: {
        id: number;
        userId: number;
        questionId: number;
        createdAt: Date;
    }[];
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
    id: number;
    examSessionId: number;
    questionNumber: number;
    body: string;
    explanation: string | null;
} | null>;
export declare function listQuestions(params: {
    q?: string;
    page: number;
    limit: number;
    userId: number;
}): Promise<{
    items: {
        flagged: boolean;
        flags: {
            id: number;
            userId: number;
            questionId: number;
            createdAt: Date;
        }[];
        id: number;
        examSessionId: number;
        questionNumber: number;
        body: string;
        explanation: string | null;
    }[];
    total: number;
}>;
export declare function findReviewCount(userId: number): Promise<number>;
//# sourceMappingURL=questions.repo.d.ts.map