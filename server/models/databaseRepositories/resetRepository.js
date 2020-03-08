const db = require("../../database/connection");

const insertResetToken = (userId, token) => {
    const query = "INSERT INTO reset(user_id,password_token,expiry_date) VALUES($1,$2,$3) RETURNING *";
    const dateTime = new Date();
    dateTime.setTime(dateTime.getTime() + (1 * 60 * 60 * 1000)); // add one hour to the current time
    const params = [userId, token, dateTime];
    return db.query(query, params);
};

const findResetToken = (userId) => {
    const query = "SELECT * FROM reset WHERE user_id =$1 ORDER BY expiry_date DESC";
    const params = [userId];
    return db.query(query, params);
};

module.exports = {
    insertResetToken: insertResetToken,
    findResetToken: findResetToken,
};
