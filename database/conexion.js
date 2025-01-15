import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;    

// DATABASE_URL = "postgresql:admin123"
const connectionString = process.env.DATABASE_URL;

export const db = new Pool({
    allowExitOnIdle: true,
    connectionString
});

const testConnection = async () => {

try {
    
    const result = await db.query('SELECT NOW()');

    console.log("Conexión a la base de datos exitosa:", result.rows[0].now);

} catch (error) {

    console.error("Error al conectar a la base de datos:", error.message);

    process.exit(1);

}

};

testConnection();
