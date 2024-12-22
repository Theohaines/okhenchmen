const sqlite3 = require('sqlite3');
const path = require('path');
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const globaljs = require("../global.js");

const passwordRegex = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;

async function signupvalidation(username, type, password, confirmPassword) {
    let validatedInfo = await validateInfo(username, type, password, confirmPassword);

    if (validatedInfo[0] != 200){
        return validatedInfo;
    }

    let checkUserExists = await globaljs.checkUserExists(username);

    if (checkUserExists[0] != 200){
        return checkUserExists;
    }

    let passwordHash = await hashPassword(password);

    if (passwordHash[0] != 200){
        return passwordHash;
    }

    let accountInserted = await insertUserIntoDB(username, type, passwordHash[1]);

    if (accountInserted){
        return accountInserted;
    }
}

async function validateInfo(username, type, password, confirmPassword) {
    let valid = await new Promise((resolve, reject) => {
        //Validate Uname, minlength=5, maxlength=30

        if (username.length > 30 || username.length < 5){
            resolve([400, "Error: Username does not meet username requirements!"]);
        }

        //Validate profile type
        if (type == "Leader"){
            //do nothing
        } else if (type == "Henchmen"){
            //do nothing
        } else {
            resolve([400, "Error: User type invalid!"]);
        }

        //Validate Password using regex

        if (passwordRegex.test(password)){
            resolve([400, "Error: Password does not meet password requirements!"]);
        }

        //Validate passwords match
        if (confirmPassword != password){
            resolve([400, "Error: Passwords do not match!"]);
        }

        resolve([200, "account validated"]);
    })

    return valid;
}

async function hashPassword(password) {
    var validated = await new Promise((resolve, reject) => {
        bcrypt
            .genSalt(10)
            .then((salt) => {
                return bcrypt.hash(password, salt);
            })
            .then((hash) => {
                resolve([200, hash]);
            })
            .catch((err) => {
                console.error(err.message);
                resolve([500, "ERROR: Internal server error! Password encryption failed."]);
            });
    });

    return validated;
}

async function insertUserIntoDB(username, type, passwordHash) {
    let db = new sqlite3.Database(path.resolve('db.sqlite'));

    let validated = await new Promise((resolve, reject) => {
        db.run("INSERT INTO users (U_NAME, U_TYPE, U_PASSWORD) VALUES (?,?,?)", [username, type, passwordHash], (err) => {
            if (err){
                resolve([500, "ERROR: Internal server error! Inserting user into database failed."]);
            }

            resolve([200, "INFO: Account successfully created!"]);
        })
    })

    db.close();
    return validated;
}

module.exports = {signupvalidation}