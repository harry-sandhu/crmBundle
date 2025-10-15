// // backend/src/types/index.d.ts
// import "express";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: { userId: string; role: "user" | "admin" };
//     }
//   }
// }

import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        refCode?: string;
      };
    }
  }
}


