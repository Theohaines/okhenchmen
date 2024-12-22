const sqlite3 = require('sqlite3');
const path = require('path');
const bcrypt = require("bcrypt");
const globaljs = require("../global.js");

async function loginvalidation(username, password) {
    let checkUserExists = await globaljs.checkUserExists(username);

    if (checkUserExists[0] == 200){
        return checkUserExists;
    }    

    let loginUser = await loginAccount(username, password);

    if (loginUser){
        return loginUser;
    }
}

async function loginAccount(username, password) {
    var db = new sqlite3.Database(path.resolve("db.sqlite"));

    var validated = await new Promise((resolve, reject) => {

        db.all("SELECT * FROM users WHERE U_NAME = ?", [username], (err, rows) => {
                if (err) {
                    resolve([500, "ERROR: Internal server error when getting user account."]);
                }

                bcrypt
                    .compare(password, rows[0].U_PASSWORD)
                    .then((res) => {
                        if (!res) {
                            resolve([400, "ERROR: Incorrect password"]);
                        } else {
                            resolve([200, "INFO: Account logged in!"]);
                        }
                    })
                    .catch((err) => {
                        console.error(err.message);
                        resolve([500, "ERROR: Internal server error when checking password match."]);
                    });
            },
        );
    });

    db.close();
    return validated;
}

module.exports = {loginvalidation}
