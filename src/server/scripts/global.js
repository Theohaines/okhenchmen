const sqlite3 = require('sqlite3');
const path = require('path');
const bcrypt = require("bcrypt");

async function checkUserExists(username) {
    let db = new sqlite3.Database(path.resolve('db.sqlite'));

    let validated = await new Promise((resolve, reject) => {
        db.all("SELECT * FROM users WHERE U_NAME = ?", [username], (err, rows) => {
            if (err){
                resolve([500, "ERROR: Internal server error! User search failed"]);
            }

            if (rows.length >= 1) {
                resolve([400, "ERROR: Account with that username already exists."]);
            } else {
                resolve([200, ""]);
            }
        })
    })

    db.close();
    return validated;
}

module.exports = {checkUserExists}