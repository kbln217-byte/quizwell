export async function getFlaggedQuestionIds(userId: number) {
  const res = await fetch(`http://localhost:3000/question-flags?userId=${userId}`);

  if (!res.ok) {
    throw new Error("目印一覧の取得に失敗しました");
  }

  return res.json() as Promise<{ questionIds: number[] }>;
}