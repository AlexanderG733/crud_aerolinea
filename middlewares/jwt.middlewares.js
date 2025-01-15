import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    let token = req.headers.authorization

    if (!token) {
       return res.status(401).json({ message: 'token provided' })
    }
    token = token.split(' ')[1]
    try { //payload token
        const {email, role} = jwt.verify(token, process.env.JWT_SECRET)
        req.email = email
        req.role = role

        next()

    }catch (error){
        console.log(error);
        return res.status(400).json({
                                error: "error al verificar token"})
    }
}

export const verifyAdmin = (req, res, next) => {
    if (req.role == 'superadmin' || req.role === 'usu1') {
        return next()
    }
    return res.status(400).json({error: "Solo ingreso a admin!"})
}