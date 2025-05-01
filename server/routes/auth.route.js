import { Router } from 'express';
import {resetPassword, forogtPassword,  verifyToken , signOut, emailVerification } from '../controllers/auth.controller.js'

const router = Router();


router.get('/email-verification', emailVerification)

router.post('/forgot-password', forogtPassword)

router.post('/reset-password', resetPassword)

router.get('/verify-token', verifyToken);

router.get('/sign-out', signOut);

export default router;