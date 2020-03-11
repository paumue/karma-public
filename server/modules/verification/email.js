const regRepo = require("../../models/databaseRepositories/registrationRepository");
const util = require("../../util/util");

/**
 * Check if input token is valid compared to
 * one stored in DB. If valid, update registration
 * record's email flag to indicate verified email.
 * @param {string} email
 * @param {string} token
 * @return {object} isValidToken, error
 */
const isValidToken = async (email, token) => {
    const regResult = await regRepo.findByEmail(email);
    const isValidResult = await util.isValidToken(regResult, token, "verificationToken");
    if (isValidResult.isValidToken) {
        const regRecord = regResult.rows[0];
        regRecord.emailFlag = 1;
        await regRepo.update(regRecord);
    }
    return isValidResult;
};

module.exports = {
    isValidToken: isValidToken,
};
