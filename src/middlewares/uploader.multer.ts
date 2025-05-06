import { NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";

export const uploader = (fileAccepted: string[]) => {
  const storage = multer.memoryStorage();

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    // console.log(req.files);
    // console.log(">>>>");

    // console.log(file);

    if (!fileAccepted.includes(file.mimetype))
      return cb(new Error("File format is not accepted"));

    cb(null, true);
  };

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 2 },
  });
};
