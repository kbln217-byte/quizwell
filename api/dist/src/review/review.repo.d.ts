export declare function findReviewCount(userId: number): Promise<number>;
export declare function findReviewQuestions(userId: number): Promise<({
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
//# sourceMappingURL=review.repo.d.ts.map