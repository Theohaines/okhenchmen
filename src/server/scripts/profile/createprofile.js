//THIS SCRIPT IS FIRST USED WHEN GENERATING A PROFILE FOR THE USER. DO NOT USE AGAIN.
const sqlite3 = require('sqlite3');
const path = require('path');

async function createprofile(username) {
    let db = new sqlite3.Database(path.resolve('db.sqlite'));

    let validated = await new Promise((resolve, reject) => {
        db.run("INSERT INTO profiles (P_OWNER) VALUES (?)", [username], (err) => {
            if (err){
                resolve([500, "ERROR: Internal server error! Inserting profile into database failed."]);
            }

            resolve([200, "INFO: profile successfully created!"]);
        })
    })

    db.close();
    return validated;
}

module.exports = {createprofile}