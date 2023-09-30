import { postCommentRepository } from "../models/repositories/postComment.repository";
import { communityCommentRepository } from "../models/repositories/communityComment.repository";
import { AppError, CommonError } from "../types/AppError";
import { getOnePost } from "../services/postService";
import { getOneCommunity } from "./communityService";

/**
 * 댓글 생성
 */
export const createComment = async (
  option: string,
  userId: number,
  id: number,
  comment: string
): Promise<void> => {
  try {
    const now = new Date();
    const krDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);

    const year = krDate.getFullYear();
    const month = String(krDate.getMonth() + 1).padStart(2, "0");
    const day = String(krDate.getDate()).padStart(2, "0");

    const createdAt = `${year}-${month}-${day}`;

    if (option === "post") {
      const post = await getOnePost(Number(id));
      if (!post) {
        throw new AppError(
          CommonError.RESOURCE_NOT_FOUND,
          "유효하지 않은 게시글입니다.",
          404
        );
      }
      await postCommentRepository.createComment(userId, id, comment, createdAt);
    } else {
      const community = await getOneCommunity(Number(id));
      if (!community) {
        throw new AppError(
          CommonError.RESOURCE_NOT_FOUND,
          "유효하지 않은 게시글입니다.",
          404
        );
      }
      await communityCommentRepository.createComment(
        userId,
        id,
        comment,
        createdAt
      );
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * post 게시물별 댓글 조회
 */
export const getPostCommentsByPostId = async (
  postId: number,
  page: number,
  pageSize: number
) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const comments = await postCommentRepository.getPostCommentsByPostId(postId);
  if (comments.length < 1) {
    throw new AppError(
      CommonError.RESOURCE_NOT_FOUND,
      "조회된 댓글이 없습니다.",
      400
    );
  }
  const totalItemsCount = comments.length;
  const currentComments = comments.slice(-2);
  const paginatedComments = comments.slice(startIndex, endIndex);
  return { paginatedComments, totalItemsCount, currentComments };
};

/**
 * community 게시물별 댓글 조회
 */
export const getCommunityCommentsByCommunityId = async (
  communityId: number,
  page: number,
  pageSize: number
) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const comments =
    await communityCommentRepository.getCommunityCommentsByCommunityId(
      communityId
    );
  if (comments.length < 1) {
    throw new AppError(
      CommonError.RESOURCE_NOT_FOUND,
      "조회된 댓글이 없습니다.",
      400
    );
  }
  const totalItemsCount = comments.length;
  const currentComments = comments.slice(-2);
  const paginatedComments = comments.slice(startIndex, endIndex);
  return { paginatedComments, totalItemsCount, currentComments };
};

// /**
//  * 댓글 수정
//  */
// export const updateComment = async (
//   newComment: string,
//   id: number,
//   userId: string
// ) => {
//   const commentsInfo = await postCommentRepository.updateComment(newComment, id);

//   if (!commentsInfo) {
//     throw new AppError(
//       CommonError.RESOURCE_NOT_FOUND,
//       "존재하지 않는 댓글입니다.",
//       404
//     );
//   }

//   if (commentsInfo.userId !== userId) {
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
// export const deleteComment = async (id: number, userId: string) => {
//   const commentsInfo = await postCommentRepository.deleteComment(id);
//   if (!commentsInfo) {
//     throw new AppError(
//       CommonError.RESOURCE_NOT_FOUND,
//       "존재하지 않는 댓글입니다.",
//       404
//     );
//   }
//   if (commentsInfo.userId !== userId) {
//     throw new AppError(
//       CommonError.UNAUTHORIZED_ACCESS,
//       "댓글을 삭제할 권한이 없습니다.",
//       403
//     );
//   }
//   await postCommentRepository.deleteComment(id);
// };
