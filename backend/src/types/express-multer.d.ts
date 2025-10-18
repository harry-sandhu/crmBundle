// src/types/express-multer.d.ts
import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    file?: Express.Multer.File;
    files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
  }
}
