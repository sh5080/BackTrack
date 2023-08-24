export interface User {
  id?: number;
  username: string;
  nickname?: string;
  password?: string;
  email: string;
  role?: string;
  accessToken?: string;
  activated?: number;
}
export interface OauthUser extends User {
  username: string;
  email: string;
  activated?: number;
  oauthProvider?: "KAKAO" | "GOOGLE" | "ORIGIN";
}

export interface UserRepository {
  createUser(user: User): Promise<User>;
  findOne(user: User): Promise<boolean>;
}

export interface Category {
  name: string;
}

export interface Backtrack {
  chordPattern: string;
  measures: number;
  bpm: number;
}
export interface SessionData {
  user_id: number;
  session_start_time: string;
  session_expire_time: string;
}
