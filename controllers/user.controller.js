import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from "../models/user.model.js";

// ruta /api/v1/user/regUser
const regUser = async (req, res) => {
    try{
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({ ok: false,
                            message: "No puede tener campos vacios" });
    }
    const user = await UserModel.findOneByEmail( email );
    if(user){
        return res.status(400).json({ ok: true,
                                    message: "El usuario ya existe"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    const newUser = await UserModel.createUser({email, password: hashedPassword, role});

    const token = jwt.sign({ email:newUser.email, role :newUser.role},
        process.env.JWT_SECRET,
        { 
            expiresIn: '1h' 
        }

    );

    return res.status(201).json({ 
                            ok: true,
                            message: {
                            token, role: newUser.role
                            }
                        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ 
            ok: false,
            message: 'Error server' 
        });
    }
}

// ruta /api/v1/user/logUser
const logUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "campos requeridos!"});
        }

        const user = await UserModel.findOneByEmail( email );
        if (!user) {
            return res.status(400).json({
                error: "usuario no existe!"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({error: "contraseña incorrecta!"});
        }

        const token = jwt.sign({ email: user.email, role: user.role},
            process.env.JWT_SECRET,
            { 
                expiresIn: '1h' 
            }
    
        );

        return res.json({ok: true,
                message:{
                    token,role:user.role
            }
        })
    }catch (error) {
        console.log(error)
        return res.status(500).json({ 
            ok: false,
            message: "Error server" });
    }
}

const profile = async (req, res) => {
    try {
        const user = await UserModel.findOneByEmail(req.email)
        return res.json({
                ok: true,
                message: user
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ 
                                ok: false,
                                message: 'Error server' 
        });
    }
}

const findeAll = async ( req, res ) => {
    try {
        const users = await UserModel.showUser()
        return res.json({ok: true,
                    message: users
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ 
                                ok: false,
                                message: 'Error server' 
        });
    }
}

export const UserController = {
    regUser,
    logUser,
    findeAll,
    profile
}