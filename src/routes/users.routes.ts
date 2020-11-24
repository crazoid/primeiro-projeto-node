import { Router } from 'express';
import { getRepository } from 'typeorm';

import User from '../models/User';
import CreatedUserService from '../services/CreateUserService';

const usersRouter = Router();

usersRouter.get('/', async (request, response) => {
    const usersRepository = getRepository(User);
    const users = await usersRepository.find();
    return response.json(users);
});

usersRouter.post('/', async (request, response) => {
    try {
        const { name, email, password } = request.body;

        const createdUser = new CreatedUserService();

        const user = await createdUser.execute({
            name,
            email,
            password
        });
                
        return response.json(user);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

export default usersRouter;