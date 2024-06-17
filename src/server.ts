import express from 'express';
import { PrismaClient } from '@prisma/client';
import registerRouter from "./routes/registerRouter";

const app = express();
const port = 3000;

// Initialize Prisma Client
const prisma = new PrismaClient();

app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, async () => {
        console.log(`Server running at http://localhost:${port}`);

        // Test the Prisma database connection
        try {
            const testUser = await prisma.user.findFirst();
            console.log('Connected to the database successfully');
        }
        catch (error) {
            console.error('Error connecting to the database:', error);
            prisma.$disconnect(); // Disconnect Prisma Client
        }

// auth routes

app.use('/auth', registerRouter);

});
