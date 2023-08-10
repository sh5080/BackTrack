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
