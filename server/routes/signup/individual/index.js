/**
 * @module Sign-up-Individual
 */

const log = require("../../../util/log");
const express = require("express");
const router = express.Router();
const userAgent = require("../../../modules/user");
const authService = require("../../../modules/authentication/");

/**
 * This is the fourth step of the signup flow (after user
 * registration and selection of individual reg).
 * The user inputs their formal name, address, DOB,
 * address, gender as well as their phone number.<br/>
 * The HTTP request object must also contain the user's ID
 * number for identification.<br/>
 * A HTTP response is generated based on the outcome of the
 * operation.
 <p><b>Route: </b>/signup/individual (POST)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {string} req.headers.authorization authToken
 * @param {object} req.body.data.individual the user input values for their profile
 * @param {object} req.body Here is an example of an appropriate request json:
 <pre><code>
    &#123;
        "data": &#123;
            "individual": &#123;
                "title": "Mr.",
                "firstName": "Paul",
                "lastName": "Test",
                "pictureId": "42", (optional)
                [...]
                address: {
                    "addressLine1": "7 Queen Lane",
                    "postCode": "WC 123",
                    [...]
                }
            &#125;
        &#125;
    &#125;
</code></pre>
 * @return {HTTP} one of the following HTTP responses:<br/>
 * - if success, 200 - individual registration successful<br/>
 * - if registration failed, 400 - error == exception
 * @name Sign-up Individual
 * @function
 */
router.post("/", authService.requireAuthentication, async (req, res) => {
    try {
        log.info("User id '%d': Signing up individual", req.body.userId);
        const individual = {
            title: req.body.data.individual.title,
            firstName: req.body.data.individual.firstName,
            lastName: req.body.data.individual.lastName,
            dateOfBirth: req.body.data.individual.dateOfBirth,
            gender: req.body.data.individual.gender,
            phoneNumber: req.body.data.individual.phoneNumber,
            pictureId: req.body.data.individual.pictureId,
            address: {
                addressLine1: req.body.data.individual.address.addressLine1,
                addressLine2: req.body.data.individual.address.addressLine2,
                townCity: req.body.data.individual.address.townCity,
                countryState: req.body.data.individual.address.countryState,
                postCode: req.body.data.individual.address.postCode,
            },
        };
        await userAgent.registerIndividual(
            req.body.userId,
            individual,
        );
        res.status(200).send({
            message: "Individual registration successful.",
        });
    } catch (e) {
        log.error("User id '%d': Failed signing up individual: " + e, req.body.userId);
        res.status(400).send({
            message: e.message,
        });
    }
});

module.exports = router;
