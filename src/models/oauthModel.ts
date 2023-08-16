import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { db } from "../loaders/dbLoader";
import { AppError, CommonError } from "../types/AppError";
import * as Type from "../types/type";

/** OAuth 사용자 저장 */
// export const saveOauthUser = async (
//   user: Type.OauthUser
// ): Promise<Type.OauthUser> => {
//   const query =
//     "INSERT INTO user (username, email, oauth_provider, password) VALUES (?, ?, ?, ?, ?)";
//   const values = [user.username, user.email, user.oauthProvider, null];

//   const [result] = await db.execute<ResultSetHeader>(query, values);

//   const createdUser: Type.OauthUser = {

//   };

//   return createdUser;
// };

// import { getConnectionManager, Repository } from "typeorm";
// import { Auth } from "./entities/";

// export const saveOauthUser = async (
//   user: Type.OauthUser
// ): Promise<Type.OauthUser> => {
//   const connectionManager = getConnectionManager();
//   const connection = connectionManager.get(); // 기본 커넥션 가져오기

//   const userRepository: Repository<Auth> = connection.getRepository(Auth);

//   const newUser = new Auth();
//   newUser.username = user.username;
//   newUser.email = user.email;
//   newUser.oauthProvider = user.oauthProvider;

//   await userRepository.save(newUser);

//   return newUser;
// };
