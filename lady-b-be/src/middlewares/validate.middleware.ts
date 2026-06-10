import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response';

type ValidationTarget = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const errors = formatZodErrors(result.error);
      sendError(res, 'Validation failed', 422, errors);
      return;
    }
    req[target] = result.data;
    next();
  };
}

function formatZodErrors(error: ZodError): Record<string, string[]> {
  return error.errors.reduce(
    (acc, err) => {
      const key = err.path.join('.') || 'root';
      acc[key] = [...(acc[key] || []), err.message];
      return acc;
    },
    {} as Record<string, string[]>,
  );
}
