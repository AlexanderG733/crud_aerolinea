
import {db} from '../database/conexion.js';

const createUser = async ({email,password,role}) => {
    const query = {
        text: `
        INSERT INTO admin.user (email,password,role) 
        VALUES ($1, $2, $3) 
        RETURNING email, password, role`,
        values: [email, password, role]   
    };
    const { rows } = await db.query(query);
    return rows[0];
}

const showUser = async () => {
    const result = {
        text: `
        SELECT * FROM  admin.user`
    };
    const { rows } = await db.query(result);
    return rows
}

const findOneByEmail = async (email) => {
    const query = {
        text: `
        SELECT * FROM admin.user
        WHERE email = $1
        `,
        values: [email]
    }
    const { rows } = await db.query(query, [email]);
    return rows[0];
}



export const UserModel = {
    createUser,
    showUser,
    findOneByEmail
}