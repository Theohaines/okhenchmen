const sqlite3 = require('sqlite3');
const path = require('path');

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

async function checkFTS(username) {
    let db = new sqlite3.Database(path.resolve('db.sqlite'));

    let validated = await new Promise((resolve, reject) => {
        db.all("SELECT U_FTS FROM users WHERE U_NAME = ?", [username], (err, rows) => {
            if (err){
                resolve([500, "ERROR: Internal server error! User search failed"]);
            }

            if (rows[0].U_FTS == "true"){
                resolve([307, "INFO: Welcome to OkHenchmen, please setup your profile."]);
            } else {
                resolve([200, ""]);
            }
        })
    })

    db.close();
    return validated;
}

async function checkProfileExists(username) {
    let db = new sqlite3.Database(path.resolve('db.sqlite'));

    let validated = await new Promise((resolve, reject) => {
        db.all("SELECT * FROM profiles WHERE P_OWNER = ?", [username], (err, rows) => {
            if (err){
                resolve([500, "ERROR: Internal server error! User search failed"]);
            }

            if (rows.length < 1) {
                resolve([404, "ERROR: Profile doesn't exist"]);
            } else {
                resolve([200, ""]);
            }
        })
    })

    db.close();
    return validated;
}

module.exports = {checkUserExists, checkFTS, checkProfileExists}