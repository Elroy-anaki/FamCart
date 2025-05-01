import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    const payload = { ...user._doc, userPassword: undefined };
    const token = jwt.sign({ payload }, String(process.env.JWT_SECRET), {
        expiresIn: 60 * 60 * 1
    });
    return { token: token, payload: payload }

};

export const jwtCookieOptions = {
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 1
};