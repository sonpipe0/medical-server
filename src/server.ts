import express from 'express';
import { PrismaClient } from '@prisma/client';

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
    try {
        console.log(`Server running at http://localhost:${port}`);

        // Test the Prisma database connection
        try {
            const testUser = await prisma.user.findFirst();
            console.log('Connected to the database successfully');
        }
        catch (error) {
            console.error('Error connecting to the database:', error);
            process.exit(1); // Exit the process with failure
        }

    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit the process with failure
    } finally {
        await prisma.$disconnect();
    }
});
