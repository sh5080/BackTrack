import { Request, Response, NextFunction } from "express";
import { AppError } from "../../types/AppError";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    const { message, name, status } = err;
    const errorResponse = {
      message,
      name,
      status,
    };
    if (message === "비정상적인 접근입니다.") {
      res.clearCookie("token");
    }
    res.status(status).json(errorResponse);
    console.error(err);
  } else {
    res.status(500).json({
      error: {
        message: "Unexpected Error",
        name: err.message,
        status: 500,
      },
    });
    console.error("non catched in error Handler: ", err);
  }
};

export { errorHandler };
