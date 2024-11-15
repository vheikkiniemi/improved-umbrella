// app.js
import { Hono } from "https://deno.land/x/hono/mod.ts";
import { registerUser } from "./routes/register.js"; // Import register logic
import { serveStatic } from "https://deno.land/x/hono/middleware.ts";

const app = new Hono();

// Serve static files from the /static directory
app.use('/static/*', serveStatic({ root: '.' }));

// Serve the registration form
app.get('/register', async (c) => {
    return c.html(await Deno.readTextFile('./views/register.html'));
});

// Route for user registration (POST request)
app.post('/register', registerUser);

Deno.serve(app.fetch);

// Run the app using the command:
// deno run --allow-net --allow-env --allow-read --watch app.js