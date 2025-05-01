import jwt from "jsonwebtoken";

function verifyToken(req, res, next) {
    try {
        const { token } = req.cookies;

        if (!token) throw new Error("Token not Exist");

        const decode = jwt.verify(token, String(process.env.JWT_SECRET));

        if (!decode) throw new Error("Token Not Valid")

        req.user = decode;

        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: error })
    }
};

export default verifyToken;