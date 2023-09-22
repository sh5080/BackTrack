import * as Type from "../../types/type";
import { BacktrackEntity } from "../entities/backtrack.entity";
import { AppDataSource } from "../../loaders/dbLoader";
import { AppError, CommonError } from "../../types/AppError";

import { PostEntity } from "../entities/post.entity";

export const BacktrackRepository = AppDataSource.getRepository(
  BacktrackEntity
).extend({
  async createBacktrack(
    username: string,
    title: string,
    backtrack: string[][][],
    createdAt: string
  ) {
    try {
      const userData = this.create({
        username,
        title,
        backtrack,
        createdAt,
      });

      await this.save(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  },
  async getMyBacktrack(username: string) {
    try {
      if (!username) {
        throw new AppError(
          CommonError.RESOURCE_NOT_FOUND,
          "사용자 정보를 찾을 수 없습니다.",
          404
        );
      }

      const allBacktracks = await this.find({
        where: { username },
      });

      return allBacktracks;
    } catch (error) {
      throw error;
    }
  },
  async getOneBacktrack(id: number) {
    try {
      const backtrackData = await this.findOne({
        where: { id },
      });

      return backtrackData;
    } catch (error) {
      throw error;
    }
  },

  async deleteBacktrackById(backtrackId: number) {
    try {
      const backtrackData = await this.findOne({ where: { id: backtrackId } });

      if (!backtrackData) {
        throw `Post with backtrackId ${backtrackId} not found`;
      }

      const userData = await this.remove(backtrackData);
      await AppDataSource.getRepository(PostEntity).delete({ backtrackId });
      return userData;
    } catch (error) {
      throw error;
    }
  },
});
