import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

import User from '../models/User';

interface Request{
    email: string;
    password: string;
}

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User,
    token: string
}

class AuthenticateUserService {
    public async execute({ email, password }: Request): Promise<Response> {
        const usersRepository = getRepository(User);
        const user = await usersRepository.findOne({ where: { email }});
        if(!user) {
            throw new Error('Incorrect email/password combination.');
        }
        
        const passwordMatched = await compare(password, user.password);

        if(!passwordMatched){
            throw new Error('Incorrect email/password combination.');
        }

        const token = sign({}, '7dcb1d79afd0a85f9b117cd1b363e6e6', {
            subject: user.id, 
            expiresIn: '1d'
        });
        return {
            user,
            token
        }
    }
}

export default AuthenticateUserService;