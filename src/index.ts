import http from "http";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import session from "express-session";

import router from "./router/index";
import authRouter from "./router/auth";

export const domain = (port: number) => {
  return `${process.env.DOMAIN}${port}`;
};

const app = express();
const PORT = 3000;

app.use(cors({ credentials: true }));

app.use(bodyParser.json());
app.use(cookieParser("SOOLAIMAN"));
app.use(compression());
app.use(
  session({
    secret: "SoolaimanGee",
    saveUninitialized: true,
    resave: true,
  })
);

// Routing
app.use("/api", router());
app.use("/api/auth", authRouter());

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on ${domain(3000)}`);
});
