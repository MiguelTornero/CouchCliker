const fs = require("fs").promises;
const path = require("path");
const Papa = require("papaparse");

const dir = "./.data";

/**
 * @type { {
 * title: string,
 * rating: string,
 * ratinglevel: string,
 * ratingdescription: string,
 * release_year: string,
 * user_rating_score: string,
 * user_rating_size: string
 * }[] }
 */
let movies = null;

const guest_user = {
    "iss":"https://accounts.google.com",
    "nbf":0,
    "aud":null,
    "sub":"000000000000000000000",
    "hd":"example.com",
    "email":"test@example.com",
    "email_verified":true,
    "azp":null,
    "name":"Guest Guest",
    "picture":null,
    "given_name":"Guest",
    "family_name":"Guest",
    "iat":0,
    "exp":0,
    "jti":null
}

fs.readFile("./netflix.csv").then((buff)=>{
    const csv = buff.toString();
    movies = Papa.parse(csv,{header: true}).data;
    console.log(movies);
}).catch(console.error);

async function save(key, obj) {
    try {
        await fs.access(dir);
    }
    catch(e){
        await fs.mkdir(dir);
    }
    
    await fs.writeFile(path.join(dir, `${key}.json`), JSON.stringify(obj));
}

async function get(key) {
    if (key === "guest") {
        return guest_user;
    }
    try {
        const output = (await fs.readFile(path.join(dir, `${key}.json`))).toString();
        return JSON.parse(output);
    }
    catch(e) {
        console.error(e);
        return null;
    }
}

async function searchMovies(query) {
    let results = [];
    for (const movie of movies) {
        if (results.length <= 100 && movie.title.toLowerCase().includes(query)) {
            results.push(movie);
        }
    }
    return results;
}

module.exports = {save, get, searchMovies};