//THIS SCRIPT IS FIRST USED WHEN GENERATING A PROFILE FOR THE USER. DO NOT USE AGAIN.
const sqlite3 = require('sqlite3');
const path = require('path');

async function loadprofile(username) {
    let db = new sqlite3.Database(path.resolve('db.sqlite'));

    let validated = await new Promise((resolve, reject) => {
        db.all("SELECT * FROM profiles WHERE P_OWNER = ?", [username], (err, rows) => {
            if (err){
                resolve([500, "ERROR: Internal server error! Loading profile failed."]);
            }

            resolve([200, rows]);
        })
    })

    db.close();
    return validated;
}

module.exports = {loadprofile}