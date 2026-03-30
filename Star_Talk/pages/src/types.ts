export type Route = { id: string; params?: any };

export type UserProfile = {
  nickname: string;
  age: number;
  grade: string;
  school: string;
  gender: "male" | "female" | "secret";
};
