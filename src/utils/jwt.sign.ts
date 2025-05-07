import jwt from "jsonwebtoken";
interface IJwtSignProps {
  userId: string;
  userRole?: string;
  verified?: boolean;
}

export const jwtSign = ({ userId, userRole, verified }: IJwtSignProps) => {
  return jwt.sign({ userId, userRole, verified }, process.env.JWT_SECRET_KEY!, {
    expiresIn: "1w",
  });
};
