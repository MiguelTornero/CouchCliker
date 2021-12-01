require('dotenv').config()

const port = parseInt(process.env.PORT) || 3000;
const clientID = process.env.GOOGLE_CLIENT_ID || "";
const baseURL = new URL(process.env.BASE_URL).href;

const db = require("./mock_db.js");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(clientID);
const HandleBars = require("express-handlebars").create({
    helpers: {
        headContents(options) {
            if (!this.__head) {this.__head = "";}
            this.__head += options.fn(this);
            return null;
        }
    }
});

app.engine("handlebars", HandleBars.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/", express.static("static"));

const authCallback = new URL("/auth/callback", baseURL);
app.get("/", (req, res)=>{
    console.log(req.cookies);
    console.log(req.body);
    if (req.cookies?.token) {
        res.redirect("/home");
    }
    res.render("signin", {authCallback, clientID})
});

app.get("/home", async(req, res)=>{
    if (!req.cookies?.token) {
        res.redirect("/");
    }
    const data = await db.get(req.cookies.token);
    console.log(data);
    res.render("home", {user: data});
});

app.get("/search", async(req, res)=>{
    if (!req.cookies?.token) {
        res.redirect("/");
    }
    const user = await db.get(req.cookies.token);
    const query = req.query?.query?.toLowerCase() || "";
    const results = await db.searchMovies(query);
    console.log(results);
    res.render("results", {results, user});
    console.log(results.length, "results for query:", query);
    console.log(req.query);
});

app.post("/auth/callback", async (req, res)=>{
    const tokens = { cookie: req.cookies.g_csrf_token, body: req.body.g_csrf_token };
    if (tokens.cookie != tokens.body) {
        res.sendStatus(400);
    }
    const ticket = await client.verifyIdToken({idToken: req.body.credential, audience: clientID});

    const playload = ticket.getPayload();
    res.cookie("token", playload.sub)
    await db.save(playload.sub, playload);
    res.redirect("/home");
});

app.listen(port, ()=>{
    console.log(`Listening on :${port}`);
});