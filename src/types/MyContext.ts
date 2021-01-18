import { Request, Response } from "express";

export interface JwtBody { userId: string; }

export interface MyContext {
  req: Request;
  res: Response;
  payload?: JwtBody;
}