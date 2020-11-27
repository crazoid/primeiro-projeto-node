import { Request, Response, NextFunction} from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';
import AppError from "../errors/AppError";

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void{
    // Validação do token JWT
    
    const authHeader = request.headers.authorization;
    
    if(!authHeader){
        throw new AppError('JWT token is missing.', 401)
    }

    // Separação do Bearer
    const [,token] = authHeader.split(' ');

    const { secret, expiresIn } = authConfig.jwt;
    
    try {
        const decoded = verify(token, secret);

        const { sub } = decoded as TokenPayload;

        request.user = { 
            id: sub,
        }

        return next();
    } catch (err) {
        throw new AppError('Invalid JWT token', 401);
    }
    
}