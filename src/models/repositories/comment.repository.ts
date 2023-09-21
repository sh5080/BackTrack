import * as Type from "../../types/type";
import { CommentEntity } from "../entities/comment.entity";
import { AppDataSource } from "../../loaders/dbLoader";
import { AppError, CommonError } from "../../types/AppError";
export const CommentRepository = AppDataSource.getRepository(
  CommentEntity
).extend({
  async createComment(
    username: string,
    postId: number,
    comment: string,
    createdAt: string
  ) {
    try {
      const commentData = this.create({
        username,
        postId,
        comment: comment,
        createdAt,
      });

      await this.save(commentData);
      return commentData;
    } catch (error) {
      throw error;
    }
  },

  async getCommentsByPostId(postId: number) {
    const existingComments = await this.find({
      where: { postId: postId },
    });

    return existingComments;
  },
});
