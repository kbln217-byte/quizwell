export declare function findWrongQuestions(): Promise<({
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
export declare function findWrongQuestionById(id: number): Promise<({
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
}) | null>;
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
//# sourceMappingURL=WrongQuestion.repo.d.ts.map