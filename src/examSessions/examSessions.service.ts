import {
  findAllSessions,
  findByIdSession
} from "./examSessions.repo";

export type JwtPayload = {
  sub: number;
};

export class HttpError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function getAllSessions() {
  return await findAllSessions();
}

export async function getSessionById(id: number) {
  const session = await findByIdSession(id);

  if (!session) {
    throw new HttpError(404, "NOT_FOUND", "session not found");
  }

  return session;
}
