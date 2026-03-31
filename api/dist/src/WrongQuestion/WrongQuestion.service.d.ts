export declare class HttpError extends Error {
    status: number;
    code: string;
    constructor(status: number, code: string, message: string);
}
export declare function getAllWrongQuestions(): Promise<({
    user: {
        id: number;
        email: string;
        name: string;
    };
    question: {
        id: number;
        examSessionId: number;
        questionNumber: number;
        body: string;
        explanation: string | null;
    };
} & {
    id: number;
    userId: number;
    questionId: number;
    createdAt: Date;
    resolvedAt: Date | null;
})[]>;
export declare function getWrongQuestionById(id: number): Promise<{
    user: {
        id: number;
        email: string;
        name: string;
    };
    question: {
        id: number;
        examSessionId: number;
        questionNumber: number;
        body: string;
        explanation: string | null;
    };
} & {
    id: number;
    userId: number;
    questionId: number;
    createdAt: Date;
    resolvedAt: Date | null;
}>;
//# sourceMappingURL=WrongQuestion.service.d.ts.map