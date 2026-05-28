import app from "./app.js";
import { configDotenv } from 'dotenv';
configDotenv();

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});