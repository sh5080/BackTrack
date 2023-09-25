import * as Type from "../../types/type";
import { communityCommentEntity } from "../entities/c.comment.entity";
import { AppDataSource } from "../../loaders/dbLoader";
import { AppError, CommonError } from "../../types/AppError";
export const communityCommentRepository = AppDataSource.getRepository(
  communityCommentEntity
).extend({
  async createComment(
    userId: number,
    communityId: number,
    comment: string,
    createdAt: string
  ) {
    try {
      const commentData = this.create({
        userId,
        communityId,
        comment,
        createdAt,
      });

      await this.save(commentData);
      return commentData;
    } catch (error) {
      throw error;
    }
  },

  async getCommunityCommentsByCommunityId(communityId: number) {
    try {
      const existingComments = await this.createQueryBuilder(
        "community_comment"
      )

        .leftJoinAndSelect("community_comment.nickname", "user")
        .where("community_comment.commynityId = :commynityId", { communityId })
        .getMany();

      const commentsWithNicknames = existingComments.map((comment) => {
        return {
          ...comment,
          nickname: comment.nickname.nickname,
        };
      });

      return commentsWithNicknames;
    } catch (error) {
      throw error;
    }
  },
});
