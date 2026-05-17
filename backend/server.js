import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import arcjet, { shield, fixedWindow } from "@arcjet/node";
import routes from "./Routes/index.js";

const app = express();

// Initialize Arcjet
const aj = arcjet({
    key: process.env.ARCJET_KEY?.trim() || "",
    characteristics: ["ip.src"],
    rules: [
        shield({ mode: "LIVE" }),
        fixedWindow({
            mode: "LIVE",
            match: "/api/auth/login",
            window: "1m",
            max: 5
        }),
    ],
});

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Arcjet Middleware
app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req);
        if (decision.isDenied()) {
            return res.status(403).json({ message: "Request blocked by security policy" });
        }
        next();
    } catch (error) {
        console.log("Arcjet local error:", error.message);
        next();
    }
});

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));