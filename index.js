require('dotenv').config()

const port = parseInt(process.env.PORT) || 3000;

const app = require("express")();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const handlebars = require("express-handlebars");

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.get("/", (req, res)=>{
    res.render("home", {name: "world"});
});

app.listen(port, ()=>{
    console.log(`Listening on :${port}`);
});