require('dotenv').config()

const port = parseInt(process.env.PORT) || 3000;
const clientID = process.env.GOOGLE_CLIENT_ID || "";
const baseURL = new URL(process.env.BASE_URL).href;

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
    
    res.render("signin", {authCallback, clientID})
});

app.post("/auth/callback", async (req, res)=>{
    console.log(req.cookies);
    console.log(req.body);
    const tokens = { cookie: req.cookies.g_csrf_token, body: req.body.g_csrf_token };
    if (tokens.cookie != tokens.body) {
        res.sendStatus(400);
    }
    const ticket = await client.verifyIdToken({idToken: req.body.credential, audience: clientID});
    
    res.json(ticket.getPayload());
});

app.listen(port, ()=>{
    console.log(`Listening on :${port}`);
});