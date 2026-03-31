export type JwtPayload = {
    sub: number;
};
export declare class HttpError extends Error {
    status: number;
    code: string;
    constructor(status: number, code: string, message: string);
}
export declare function login(email: string): Promise<{
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}>;
export declare function register(input: {
    name: string;
    email: string;
}): Promise<{
    user: {
        id: number;
        email: string;
        name: string;
    };
    isNewUser: boolean;
}>;
export declare function getAllUsers(): Promise<{
    id: number;
    email: string;
    name: string;
}[]>;
export declare function getUserById(id: number): Promise<{
    id: number;
    email: string;
    name: string;
}>;
export declare function removeUser(id: number): Promise<{
    id: number;
    email: string;
    name: string;
}>;
export declare function putUserById(id: number, input: {
    name: string;
    email: string;
}): Promise<{
    id: number;
    email: string;
    name: string;
}>;
//# sourceMappingURL=users.service.d.ts.map