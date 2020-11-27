import { Router } from 'express';
import { getRepository } from 'typeorm';
import multer from 'multer';
import uploadConfig from '../config/upload';

import User from '../models/User';
import CreatedUserService from '../services/CreateUserService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();

const upload = multer(uploadConfig);

usersRouter.get('/', async (request, response) => {
    const usersRepository = getRepository(User);
    const users = await usersRepository.find();
    return response.json(users);
});

usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    const createdUser = new CreatedUserService();

    const user = await createdUser.execute({
        name,
        email,
        password
    });

    delete user.password;
            
    return response.json(user);
});

usersRouter.patch('/avatar', 
    ensureAuthenticated, 
    upload.single('avatar'), 
    async (request, response) => {
        const updateUserAvatar = new UpdateUserAvatarService();

        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename
        });
        delete user.password;
        return response.json(user);
    })

export default usersRouter;