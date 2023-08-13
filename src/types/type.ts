export interface User {
  username: string;
  password: string | null;
  email: string;
  role?: string;
  accessToken?: string;
  activated?: number;
}
export interface Backtrack {
  chordPattern: string;
  measures: number;
  bpm: number;
}

export interface OauthUser extends User {
  username: string;
  email: string;
  activated?: number;
  oauthProvider?: "KAKAO" | "GOOGLE" | "ORIGIN";
}
