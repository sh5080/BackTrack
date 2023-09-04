import { NextFunction, Request, Response } from "express";
import * as chatService from "../services/chatService";
import { AppError, CommonError } from "../types/AppError";
import { CustomRequest } from "../types/customRequest";
import { io } from "../api/routes/chatRoutes";

// [사용자] 채팅 생성
export const createChatByUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message } = req.body;
    const username = req.user!.username;
    const newMessage = await chatService.createChat(username, message);

    // 메세지를 클라이언트로 전송
    io.emit("chat message", newMessage);

    res.status(201).json({
      message: newMessage,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// [어드민] 채팅 생성
export const createChatByAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message } = req.body;
    const username = req.user!.username;
    const newMessage = await chatService.createChat(username, message);

    // 메세지를 클라이언트로 전송
    io.emit("chat message", newMessage);

    res.status(201).json({
      message: newMessage,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// export const getChatByUser = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { message } = req.body;
//     const newMessage = await chatService.getChat({
//       message,
//     });
//     res.status(201).json({
//       message: newMessage,
//     });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

// export const getChatByAdmin = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { message } = req.body;
//     const newMessage = await chatService.getChat({
//       message,
//     });
//     res.status(201).json({
//       message: newMessage,
//     });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };
