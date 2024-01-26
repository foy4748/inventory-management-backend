import { Response } from 'express';

export interface TResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  data: T;
}

export default function sendResponse<T>(res: Response, data: TResponse<T>) {
  return res.status(data?.statusCode || 200).send(data);
}
