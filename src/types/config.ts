export interface Config {
  port: number;

  jwt: {
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
    ACCESS_TOKEN_EXPIRES_IN: string;
  };
  database: {
    DB_HOST: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_SYNCRONIZE: number;
  };
  bcrypt: {
    saltRounds: number;
  };
  nodemailer: {
    SERVICE: string;
    USERNAME: string;
    ADDRESS: string;
    PASSWORD: string;
  };
  google: {
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_REDIRECT_URI: string;
  };
  kakao: {
    KAKAO_CLIENT_ID: string;
    KAKAO_REDIRECT_URI: string;
  };
  server: {
    URL: string;
  };
}
