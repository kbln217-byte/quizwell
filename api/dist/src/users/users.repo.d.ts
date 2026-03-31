export declare function findByEmail(email: string): Promise<{
    id: number;
    email: string;
    name: string;
} | null>;
export declare function createUser(input: {
    name: string;
    email: string;
}): Promise<{
    id: number;
    email: string;
    name: string;
}>;
export declare function findByIdUser(id: number): Promise<{
    id: number;
    email: string;
    name: string;
} | null>;
export declare function listUsers(params: {
    q?: string;
    page: number;
    limit: number;
}): Promise<{
    items: {
        id: number;
        email: string;
        name: string;
    }[];
    total: number;
}>;
export declare function findAllUsers(): Promise<{
    id: number;
    email: string;
    name: string;
}[]>;
export declare function putUser(id: number, input: {
    name: string;
    email: string;
}): Promise<{
    id: number;
    email: string;
    name: string;
}>;
export declare function deleteUserById(id: number): Promise<{
    id: number;
    email: string;
    name: string;
}>;
//# sourceMappingURL=users.repo.d.ts.map