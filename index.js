require('dotenv').config()

const port = parseInt(process.env.PORT) || 3000;
const clientID = process.env.GOOGLE_CLIENT_ID || "";
const baseURL = new URL(process.env.BASE_URL).href;

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { response } = require('express');
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
    //res.render("home", {name: "world"});
    
    res.render("signin", {authCallback, clientID})
});

app.listen(port, ()=>{
    console.log(`Listening on :${port}`);
});