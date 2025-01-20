import jwt from "jsonwebtoken";

export const sign = (payload: any): string => {
  const token = jwt.sign(payload, "hii");
  return token;
};
