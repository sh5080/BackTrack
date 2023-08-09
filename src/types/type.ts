export interface Note {
  chordPattern: string;
  // duration: number;
}
export interface User {
  username: string;
  password: string | null;
  email: string;
  role?: string;
  accessToken?: string;
  activated?: number;
}
