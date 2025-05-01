import { Router } from 'express';
import { signUp, signIn, editUserDetails ,getAllUsers, signUpWithGoogle} from '../controllers/user.controller.js';

const router = Router();

router.get('/get-all-users', getAllUsers);

router.post('/sign-up', signUp);

router.post('/sign-up/:provider', signUpWithGoogle);

router.post('/sign-in', signIn);

router.put('/edit-user-details/:id', editUserDetails)



export default router;