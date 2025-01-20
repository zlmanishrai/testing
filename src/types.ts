declare namespace Express {
  export interface Request {
    user: IPayload;
  }
}

export interface IPayload {
  id: string;
  bio: string;
  role: string;
}
