require('dotenv').config()

const port = parseInt(process.env.PORT) || 3000;

const app = require("express")();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.listen(port, ()=>{
    console.log(`Listening on :${port}`);
});