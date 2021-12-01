const fs = require("fs").promises;
const path = require("path");

const dir = "./.data";

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
    try {
        const output = (await fs.readFile(path.join(dir, `${key}.json`))).toString();
        return JSON.parse(output);
    }
    catch(e) {
        console.error(e);
        return null;
    }
}

module.exports = {save, get};