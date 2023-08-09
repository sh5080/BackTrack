import dotenv from "dotenv";
import { Config } from "../types/config";

dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;

  if (!value) {
    throw new Error(`${key} 환경 변수가 필요합니다.`);
  }

  return value;
};

const getEnvNumber = (key: string, defaultValue?: number): number => {
  const value = Number(process.env[key]) ?? defaultValue;

  if (!value && value !== 0) {
    throw new Error(`${key} 환경 변수가 필요합니다.`);
  }

  return value;
};

const config: Config = {
  /** [포트] 포트 번호 */
  port: getEnvNumber("PORT"),

  jwt: {
    /** [JWT] 액세스 토큰 비밀 키 */
    ACCESS_TOKEN_SECRET: getEnv("ACCESS_TOKEN_SECRET"),
    /** [JWT] 리프레시 토큰 비밀 키 */
    REFRESH_TOKEN_SECRET: getEnv("REFRESH_TOKEN_SECRET"),
    /** [JWT] 리프레시 토큰 만료 시간 */
    REFRESH_TOKEN_EXPIRES_IN: getEnv("REFRESH_TOKEN_EXPIRES_IN", "7d"),
    /** [JWT] 액세스 토큰 만료 시간 */
    ACCESS_TOKEN_EXPIRES_IN: getEnv("ACCESS_TOKEN_EXPIRES_IN", "12h"),
  },

  database: {
    /** [데이터베이스] 데이터베이스 호스트 */
    DB_HOST: getEnv("DB_HOST"),
    /** [데이터베이스] 데이터베이스 사용자 */
    DB_USER: getEnv("DB_USER"),
    /** [데이터베이스] 데이터베이스 비밀번호 */
    DB_PASSWORD: getEnv("DB_PASSWORD"),
    /** [데이터베이스] 데이터베이스 이름 */
    DB_NAME: getEnv("DB_NAME"),
  },

  bcrypt: {
    /** [bcrypt] 솔트 라운드 */
    saltRounds: getEnvNumber("BCRYPT_SALT_ROUNDS", 10),
  },
};

export default config;
