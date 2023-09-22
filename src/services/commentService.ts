import { CommentRepository } from "../models/repositories/comment.repository";
import { AppError, CommonError } from "../types/AppError";
import { getOnePost } from "../services/postService";

/**
 * 댓글 생성
 */
export const createComment = async (
  username: string,
  postId: number,
  comment: string
): Promise<void> => {
  try {
    const post = await getOnePost(Number(postId));
    if (!post) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "유효하지 않은 게시글입니다.",
        404
      );
    }

    const now = new Date();
    const krDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);

    const year = krDate.getFullYear();
    const month = String(krDate.getMonth() + 1).padStart(2, "0");
    const day = String(krDate.getDate()).padStart(2, "0");

    const createdAt = `${year}-${month}-${day}`;

    await CommentRepository.createComment(username, postId, comment, createdAt);
  } catch (error) {
    console.error(error);
  }
};

/**
 * 게시물별 댓글 조회
 */
export const getCommentsByPostId = async (
  postId: number,
  page: number,
  pageSize: number
) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const comments = await CommentRepository.getCommentsByPostId(postId);
  const totalItemsCount = comments.length;
  const currentComments = comments.slice(0, 2);
  const paginatedComments = comments.slice(startIndex, endIndex);
  return { paginatedComments, totalItemsCount, currentComments };
};

// /**
//  * 댓글 수정
//  */
// export const updateComment = async (
//   newComment: string,
//   id: number,
//   username: string
// ) => {
//   const commentsInfo = await CommentRepository.updateComment(newComment, id);

//   if (!commentsInfo) {
//     throw new AppError(
//       CommonError.RESOURCE_NOT_FOUND,
//       "존재하지 않는 댓글입니다.",
//       404
//     );
//   }

//   if (commentsInfo.username !== username) {
//     throw new AppError(
//       CommonError.UNAUTHORIZED_ACCESS,
//       "댓글을 수정할 권한이 없습니다.",
//       403
//     );
//   }
//   return commentsInfo;
// };

// /**
//  * 댓글 삭제
//  */
// export const deleteComment = async (id: number, username: string) => {
//   const commentsInfo = await CommentRepository.deleteComment(id);
//   if (!commentsInfo) {
//     throw new AppError(
//       CommonError.RESOURCE_NOT_FOUND,
//       "존재하지 않는 댓글입니다.",
//       404
//     );
//   }
//   if (commentsInfo.username !== username) {
//     throw new AppError(
//       CommonError.UNAUTHORIZED_ACCESS,
//       "댓글을 삭제할 권한이 없습니다.",
//       403
//     );
//   }
//   await CommentRepository.deleteComment(id);
// };
