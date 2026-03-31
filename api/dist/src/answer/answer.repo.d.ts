export declare function createAnswer(input: {
    userId: number;
    questionId: number;
    selectedChoiceId?: number;
    isCorrect: boolean;
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
export declare function findAllAnswers(): Promise<({
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
export declare function findAnswerById(id: number): Promise<({
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
}) | null>;
export declare function findUserById(id: number): Promise<{
    id: number;
    email: string;
    name: string;
} | null>;
export declare function findQuestionById(id: number): Promise<{
    id: number;
    examSessionId: number;
    questionNumber: number;
    body: string;
    explanation: string | null;
} | null>;
export declare function findChoiceById(id: number): Promise<{
    id: number;
    isCorrect: boolean;
    questionId: number;
    label: string;
    text: string;
} | null>;
export declare function findWrongQuestion(userId: number, questionId: number): Promise<{
    id: number;
    userId: number;
    questionId: number;
    createdAt: Date;
    resolvedAt: Date | null;
} | null>;
export declare function createWrongQuestion(userId: number, questionId: number): Promise<{
    id: number;
    userId: number;
    questionId: number;
    createdAt: Date;
    resolvedAt: Date | null;
}>;
export declare function resolveWrongQuestion(id: number): Promise<{
    id: number;
    userId: number;
    questionId: number;
    createdAt: Date;
    resolvedAt: Date | null;
}>;
//# sourceMappingURL=answer.repo.d.ts.map