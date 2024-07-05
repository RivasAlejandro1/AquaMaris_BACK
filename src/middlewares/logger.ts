import {
    NextFunction, Request, Response
} from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
    console.log(`A request ${req.method} was made to route ${req.url}`)
    next()
 }