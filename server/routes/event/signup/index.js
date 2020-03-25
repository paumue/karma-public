/**
 * @module Event-Signup
 */

const log = require("../../../util/log");
const express = require('express');
const router = express.Router();

const eventSignupService = require("../../../modules/event/signup");
const httpUtil = require("../../../util/http");
const util = require("../../../util");
const validation = require("../../../modules/validation");
const authService = require("../../../modules/authentication/");
/**
 * Endpoint called whenever a user wishes to sign up to an event.<br/>
 <p><b>Route: </b>/event/:id/signUp (POST)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {string} req.headers.authorization authToken
 * @param {Event} req.body - Information regarding the event containing the same properties as this example:
 <pre>
 {
    "confirmed": "true"
  }
 </pre>
 * @returns {Object}
 *  status: 200, description: The signup object created <br/>
 <pre>
 {
    "message": "Favourite added successfully",
    "data": {
        "signup": {
            "individualId": 7,
            "eventId": 11,
            "confirmed": true
        }
    }
 }
 </pre>
 *  status: 500, description: DB error
 *  @name Sign up to event
 *  @function
 */
router.post('/:eventId/signUp', authService.requireAuthentication, async (req, res) => {
    try {
        const signup = {...req.body, eventId: Number.parseInt(req.params.eventId)};
        log.info("Signing up user id '%d' to event id '%d'", signup.userId, signup.eventId);

        signup.individualId = await util.getIndividualIdFromUserId(signup.userId);
        const validationResult = validation.validateSignup(signup);
        if (validationResult.errors.length > 0) {
            return httpUtil.sendValidationErrors(validationResult, res);
        }

        const signupResult = await eventSignupService.createSignup(signup);
        return httpUtil.sendResult(signupResult, res);
    } catch (e) {
        log.error("Error while creating signup: " + e.message);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called to get all users signed up to an event.<br/>
 <p><b>Route: </b>/event/:id/signUp (GET)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {string} req.headers.authorization authToken
 * @param {Number} req.params.eventId - id of the event.
 * @returns {object}
 *  status: 200, description: Array of all users signed up with necessary details named users<br/>
 <pre>
 {
    "message": "Favourite added successfully",
    "data": {
        "users": [
            {
                "userId": 7,
                "individualId": 15,
                "email": "asd@asd.asd",
                "username": "Sten"
                [...]
            }
            {
                "userId": 8,
                "individualId": 16,
                "email": "asd@asd.asd",
                "username": "Sten"
                [...]
            }
        ]
    }
 }
 </pre>
 *  status: 400, description: Event id not specified or specified in wrong format<br/>
 *  status: 404, description: No event with id specified found or no users signed up<br/>
 *  status: 500, description: DB error
 *  @name See signed up users
 *  @function
 */
router.get('/:eventId/signUp', authService.requireAuthentication, async (req, res) => {
    try {
        const eventId = Number.parseInt(req.params.eventId);
        log.info("Getting all users signed up to event id '%d'", eventId);
        const signupsResult = await eventSignupService.getAllSignupsForEvent(eventId);
        return httpUtil.sendResult(signupsResult, res);
    } catch (e) {
        log.error("Error while fetching signups: " + e.message);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called whenever a user wishes to see all events they have attended. This only shows past events<br/>
 <p><b>Route: </b>/event/signUp/history (GET)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {string} req.headers.authorization authToken
 * @returns {Object}
 *  status: 200, description: Array of all events the user has signed up to<br/>
 <pre>
 {
  message:"All activities successfully fetched",
  "data": {
       "events": [
           {
               "eventId": 1,
               "name": "Community help centre",
               "womenOnly": false,
               "spots": 3,
               "addressVisible": true,
               "minimumAge": 18,
               "photoId": false,
               "physical": false,
               "addInfo": true,
               "content": "help people at the community help centre because help is good",
               "date": "2020-03-25T19:10:00.000Z",
               "eventCreatorId": 1,
               "address1": "nearby road",
               "address2": null,
               "postcode": "whatever",
               "city": "London",
               "region": null,
               "lat": 51.4161220,
               "long": -0.1866410,
                "distance": 0.18548890708299523
           },
           {
               "eventId": 2,
               "name": "Picking up trash",
               "womenOnly": false,
               "spots": 5,
               "addressVisible": true,
               "minimumAge": 18,
               "photoId": false,
               "physical": false,
               "addInfo": true,
               "content": "small class to teach other people how to pick themselves up",
               "date": "2020-03-25T19:10:00.000Z",
               "eventCreatorId": 1,
               "address1": "uni road",
               "address2": null,
               "postcode": "whatever",
               "city": "London",
               "region": null,
               "lat": 51.5114070,
               "long": -0.1159050,
               "distance": 7.399274608089304
           }
       ]
   }
 }
 </pre>
 *  status: 500, description: DB error
 *  @name See signup history
 *  @function
 */
router.get('/signUp/history', authService.requireAuthentication, async (req, res) => {
    try {
        const userId = Number.parseInt(req.query.userId);
        log.info("Getting signup history for user id '%d'", userId);
        const individualId = await util.getIndividualIdFromUserId(userId);
        if (individualId === undefined) {
            return res.send(400).body({message: "IndividualId not specified"});
        }

        const signupsResult = await eventSignupService.getSignupHistory(individualId);
        return httpUtil.sendResult(signupsResult, res);
    } catch (e) {
        log.error("Error while fetching signup history: " + e.message);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called whenever a user updates their attendance confirmation in an event.<br/>
 <p><b>Route: </b>/event/:eventId/signUp/update/ (POST)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {string} req.headers.authorization authToken
 * @param {Event} req.body - Information regarding the event containing the same properties as this example:
 <pre>
 {
    "userId": "3",
    "confirmed": false,
    "attended": true,
  }
 </pre>
 * @returns {Object}
 *  status: 200, description: The signup object updated<br/>
 <pre>
 {
    "message": "Signup updated successfully",
    "data": {
        "signup": {
            "individualId": 7,
            "eventId": 11,
            "confirmed": true
            "attended": true
        }
    }
 }
 </pre>
 *  status: 500, description: DB error
 *  @name Update signup status for event
 *  @function
 */
router.post('/:eventId/signUp/update', authService.requireAuthentication, async (req, res) => {
    try {
        const signup = {...req.body, eventId: Number.parseInt(req.params.eventId)};
        log.info("Updating signup for user id '%d' to event id '%d'", signup.userId, signup.eventId);
        signup.individualId = await util.getIndividualIdFromUserId(signup.userId);
        const validationResult = validation.validateSignup(signup);
        if (validationResult.errors.length > 0) {
            return httpUtil.sendValidationErrors(validationResult, res);
        }
        const signupsResult = await eventSignupService.updateSignUp(signup);
        return httpUtil.sendResult(signupsResult, res);
    } catch (e) {
        log.error("Updating signup failed: " + e);
        return httpUtil.sendGenericError(e, res);
    }
});


module.exports = router;
