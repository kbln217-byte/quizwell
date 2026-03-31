export declare class HttpError extends Error {
    status: number;
    code: string;
    constructor(status: number, code: string, message: string);
}
export declare function getAllAnswers(): Promise<({
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
    selectedChoice: {
        id: number;
        isCorrect: boolean;
        questionId: number;
        label: string;
        text: string;
    } | null;
} & {
    id: number;
    isCorrect: boolean;
    answeredAt: Date;
    userId: number;
    questionId: number;
    selectedChoiceId: number | null;
})[]>;
export declare function getAnswerById(id: number): Promise<{
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
    selectedChoice: {
        id: number;
        isCorrect: boolean;
        questionId: number;
        label: string;
        text: string;
    } | null;
} & {
    id: number;
    isCorrect: boolean;
    answeredAt: Date;
    userId: number;
    questionId: number;
    selectedChoiceId: number | null;
}>;
export declare function registerAnswer(input: {
    userId?: number;
    questionId?: number;
    selectedChoiceId?: number;
}): Promise<{
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
    selectedChoice: {
        id: number;
        isCorrect: boolean;
        questionId: number;
        label: string;
        text: string;
    } | null;
} & {
    id: number;
    isCorrect: boolean;
    answeredAt: Date;
    userId: number;
    questionId: number;
    selectedChoiceId: number | null;
}>;
//# sourceMappingURL=answer.service.d.ts.map