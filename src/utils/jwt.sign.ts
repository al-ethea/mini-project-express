import jwt from "jsonwebtoken";
interface IJwtSignProps {
  userId: string;
  userRole?: string;
  isVerified?: boolean;
}

export const jwtSign = ({ userId, userRole, isVerified }: IJwtSignProps) => {
  return jwt.sign(
    { userId, userRole, isVerified },
    process.env.JWT_SECRET_KEY!,
    {
      expiresIn: "1w",
    }
  );
};
