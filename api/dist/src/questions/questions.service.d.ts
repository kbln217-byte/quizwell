export declare function getAllQuestions(): Promise<{
    id: number;
    examSessionId: number;
    questionNumber: number;
    body: string;
    explanation: string | null;
}[]>;
export declare function getQuestionById(id: number, userId: number): Promise<{
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
}>;
export declare function getQuestions(params: {
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
//# sourceMappingURL=questions.service.d.ts.map