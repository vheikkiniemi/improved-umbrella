//import { Hono } from 'npm:hono';
//import { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.js';
//import * as bcrypt from 'https://deno.land/x/bcrypt@v0.2.4/mod.js';

import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";


const app = new Hono();
const client = new Client({
    user: 'postgres',
    database: 'postgres',
    hostname: 'localhost',
    password: 'Secret1234!',
    port: 5432,
});

// docker run --name booking_system_database -e POSTGRES_PASSWORD=Secret1234! -d -p 5432:5432 postgres

await client.connect();

app.post('/register', async (c) => {
    const { username, password, email, age } = await c.req.json();
    const hashedPassword = await bcrypt.hash(password);

    try {
        await client.queryObject(`
            INSERT INTO abc123_users (username, password, email, role, age, pseudonym, consent)
            VALUES ($1, $2, $3, 'reserver', $4, $5, TRUE)
        `, username, hashedPassword, email, age, `pseudonym_${username}`);

        return c.json({ message: 'User registered successfully' }, 201);
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Registration failed' }, 500);
    }
});

app.get('/', async (c) => {
    const html = await Deno.readTextFile('./index.html');
    return c.html(html);
});

// app.listen({ port: 8000 });
Deno.serve(app.fetch);
