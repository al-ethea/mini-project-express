import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routers/auth.router";
import userRouter from "./routers/user.router";
import referralRouter from "./routers/referral.router";
import organizerRouter from "./routers/organizer.router";
import eventRouter from "./routers/event.router";

const app: Express = express();
const port = 5005;
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Welcome to Express Typescript Server</h1>");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/events", eventRouter);
// app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/referral", referralRouter);
app.use("/api/organizer", organizerRouter);
app.use("/api/event", eventRouter);

// Centralized Error
interface IError extends Error {
  isExpose: boolean;
  status: number;
  msg: string;
}
app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
  console.log(">>>");
  console.log(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.isExpose
      ? err.message
      : err.message === "jwt expired"
      ? "Session login is expired"
      : "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`🍏 [server]: Server is running at http://localhost:${port}`);
});
