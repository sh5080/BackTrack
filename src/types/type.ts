export interface User {
  id?: number;
  username: string;
  nickname: string;
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

export interface Popup {
  description: string;
  imgNames: string;
}

export interface Backtrack {
  username: string;
  backtrack: string[][][];
  // measures: number;
  // bpm: number;
}
export interface SessionData {
  username: string;
  nickname: string;
  refreshToken: string;
  session_start_time: string;
  session_expire_time: string;
}

export interface ChatMessage {
  chat_id: string;
  message: string;
  created_at: Date;
}
