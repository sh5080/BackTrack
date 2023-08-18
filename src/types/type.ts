export interface User {
  id?: number;
  username: string;
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
  image: string;
}

export interface Backtrack {
  chordPattern: string;
  measures: number;
  bpm: number;
}
