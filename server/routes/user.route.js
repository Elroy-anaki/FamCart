import { Router } from 'express';
import { signUp, signIn, editUserDetails ,getAllUsers, signUpWithGoogle} from '../controllers/user.controller.js';

const userRouter = Router();


userRouter.post('/sign-up', signUp);

userRouter.post('/sign-in', signIn);

userRouter.put('/edit-user-details/:id', editUserDetails)



export default userRouter;