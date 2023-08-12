import { FieldPacket, OkPacket, RowDataPacket } from "mysql2";
import { db } from "../loaders/dbLoader";
import { AppError, CommonError } from "../types/AppError";
import * as User from "../types/type";

/**
 * 사용자 생성
 */
export const createUser = async (user: User.User): Promise<void> => {
  try {
    await db.execute(
      "INSERT INTO user (username, password, email) VALUES (?, ?, ?)",
      [user.username, user.password, user.email]
    );
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(CommonError.DB_ERROR, "회원가입에 실패했습니다.", 500);
    }
  }
};

/**
 * 사용자 아이디로 사용자 정보 조회
 */
export const getUserByUsername = async (username?: string) => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute(
      "SELECT * FROM user WHERE username = ?",
      [username]
    );
    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        CommonError.DB_ERROR,
        "사용자 정보 조회에 실패했습니다.",
        500
      );
    }
  }
};

/**
 * 이메일로 사용자 정보 조회
 */
export const getUserByEmail = async (
  email?: string
): Promise<User.User | null> => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );

    return null;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        CommonError.DB_ERROR,
        "사용자 정보 조회에 실패했습니다.",
        500
      );
    }
  }
};

/**
 * 사용자 정보 수정
 */
export const updateUserByUsername = async (
  userId: string,
  updateData: Partial<Pick<User.User, "email" | "password">>
) => {
  try {
    const { email, password } = updateData;

    await db.execute(
      "UPDATE user SET email = ?, password = ? WHERE username = ?",
      [email, password, userId]
    );

    const updatedUser = await getUserByUsername(userId);
    return updatedUser;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        CommonError.DB_ERROR,
        "사용자 정보 수정에 실패했습니다.",
        500
      );
    }
  }
};

/**
 * 사용자 삭제
 */
export const deleteUserByUsername = async (username: string) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      "SELECT * FROM user WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      throw new AppError(
        CommonError.DB_ERROR,
        "존재하지 않는 사용자입니다.",
        401
      );
    }

    await connection.execute<OkPacket>("DELETE FROM user WHERE username = ?", [
      username,
    ]);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        CommonError.DB_ERROR,
        "회원 탈퇴에 실패했습니다.",
        500
      );
    }
  } finally {
    connection.release();
  }
};
