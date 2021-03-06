/**
 * @module Event
 */
const log = require("../../util/log");
const express = require("express");
const router = express.Router();

const eventSignupRoute = require("./signup/");
const eventFavouriteRoute = require("./favourite/");
const eventSelectRoute = require("./select/");

const httpUtil = require("../../util/http");
const validation = require("../../modules/validation");
const eventService = require("../../modules/event");
const paginator = require("../../modules/pagination");
const authService = require("../../modules/authentication/");

router.use("/", eventSignupRoute);
router.use("/", eventFavouriteRoute);
router.use("/", eventSelectRoute);


/**
 * Endpoint called when "All" tab is pressed in Activities homepage<br/>
 * URL example: REACT_APP_API_URL/event?pageSize=2&currentPage=1
&filter[]=!womenOnly&filter[]=physical&availabilityStart=2020-03-03&availabilityEnd=2020-12-03&maxDistance=5000<br/>
 <p><b>Route: </b>/event (GET)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {string} req.headers.authorization authToken
 * @param {Array} req.query.filter - OPTIONAL: all boolean filters required as an array of strings
 * The boolean filters allowed are: "women_only", "physical", "photo_id", "address_visible", "add_info".
 * @param {Object} req.query.maxDistance - OPTIONAL: maximum distance from the user filter(inclusive)
 * @param {Object} req.query.availabilityStart - OPTIONAL: when user is first available filter(inclusive)
 * @param {Object} req.query.availabilityEnd - OPTIONAL: when user is last available filter(inclusive)
 * @returns {Object}
 *  status: 200, description: Array of all future event objects sorted by time
 *  and distance from the user (distance measured in miles), along with pagination information as follows:
 <pre>
{
    "message": "All Events fetched successfully",
    "data": {
        "meta": {
            "currentPage": 1,
            "pageCount": 1,
            "pageSize": 2,
            "count": 3
        },
        "events": [
            {
                "eventId": 2,
                "name": "Event close to user 1",
                "womenOnly": true,
                "spotsAvailable": 20,
                "addressVisible": true,
                "minimumAge": 21,
                "photoId": false,
                "physical": true,
                "addInfo": false,
                "content": "risus. Quisque libero lacus, varius et, euismod et, commodo at, libero. Morbi accumsan laoreet",
                "date": "2020-07-04T23:00:00.000Z",
                "eventCreatorId": 1,
                "address1": "nearby road",
                "address2": "wherever",
                "postcode": "SW19 2LF",
                "city": "London",
                "region": "region",
                "lat": 51.416122,
                "long": -0.186641,
                "volunteers": [
                    1,
                    21,
                    36,
                    2,
                    24,
                    13,
                    29,
                    46,
                    37,
                    39,
                    49,
                    12
                ],
                "going": true,
                "spotsRemaining": 8,
                "distance": 0.18548890708299523,
                "causes": [1,2,3]
            },
            {
                "eventId": 3,
                "name": "Event in KCL",
                "womenOnly": false,
                "spotsAvailable": 30,
                "addressVisible": true,
                "minimumAge": 20,
                "photoId": false,
                "physical": true,
                "addInfo": true,
                "content": "nunc sit amet metus. Aliquam erat volutpat. Nulla facili",
                "date": "2020-04-08T23:00:00.000Z",
                "eventCreatorId": 1,
                "address1": "uni road",
                "address2": "wherever",
                "postcode": "SE1 1DR",
                "city": "London",
                "region": "region",
                "lat": 51.511407,
                "long": -0.115905,
                "volunteers": [
                    1,
                    34
                ],
                "going": true,
                "spotsRemaining": 28,
                "distance": 7.399274608089304,
                "causes": [1,2,3]
            }
        ]
    }
}
 </pre>
 *  status: 400, description: if userID param is not specified or in wrong format/NaN <br/>
 *  status: 404, description: if userID doesn't belong to any user <br/>
 *  status: 500, description: Most probably a database error occurred
 *  @function
 *  @name Get "All" Activities tab
 */
router.get("/", authService.requireAuthentication, async (req, res) => {
    try {
        const userId = Number.parseInt(req.query.userId);
        log.info("User id '%d': Getting 'All' tab", userId);
        const filters = {booleans: req.query.filter};
        filters.availabilityStart = req.query.availabilityStart;
        filters.availabilityEnd = req.query.availabilityEnd;
        filters.maxDistance = req.query.maxDistance;

        const getEventsResult = await eventService.getEvents(filters, userId);
        getEventsResult.data = await paginator.getPageData(req, getEventsResult.data.events);
        return httpUtil.sendResult(getEventsResult, res);
    } catch (e) {
        log.error("User id '%d': Getting 'All' tab failed: " + e, req.query.userId);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called whenever a user requests information about an event.
 <p><b>Route: </b>/event/:id (GET)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {string} req.headers.authorization authToken
 * @param {Number} id - id of requested event.
 * @returns {object}
 *  status: 200, description: Information regarding the event containing the same properties as this example
 <pre>
 {
    "message": "Event fetched successfully",
    "data": {
        "event": {
            "id": 7,
            "name": "event",
            "addressId": 24,
            "womenOnly": true,
            "spots": 3,
            "addressVisible": true,
            "minimumAge": 16,
            "photoId": true,
            "physical": true,
            "addInfo": true,
            "content": "fun event yay",
            "date": "2004-10-19T09:23:54.000Z",
            "userId": 27,
            "spotsRemaining": 1,
            "address": {
                "id": 24,
                "address1": "221B Baker St",
                "address2": "Marleybone",
                "postcode": "NW1 6XE",
                "city": "London",
                "region": "Greater London",
                "lat": 51.5237740,
                "long": -0.1585340
            }
            "causes": [
                {
                    "id": 1,
                    "name": "animals",
                    "title": "Animals",
                    "description": "Morbi accumsan laoreet ipsum. Curabitur"
                }
            ]
        }
    }
}
 </pre>
 *  status: 500, description: DB error
 *  @function
 *  @name Get event by id
 *  */
router.get("/:id", authService.requireAuthentication, async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        log.info("User id '%d': Fetching event id '%d'", req.query.userId, id);
        const getEventResult = await eventService.getEventData(id);
        return httpUtil.sendResult(getEventResult, res);
    } catch (e) {
        log.error("User id '%d': Fetching event id '%d' failed: " + e, req.query.userId, req.params.id);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called whenever a user creates a new event.<br/>
 * If an existing addressId is specified in the request, it is reused and no new address is created.<br/>
 <p><b>Route: </b>/event (POST)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {string} req.headers.authorization authToken
 * @param {Event} req.body - Information regarding the event containing the same properties as this example:
 <pre>
 {
    "address": {
        "address1": "Line 1",
        "address2": "Line 2",
        "postcode": "14 aa",
        "city": "LDN",
        "region": "LDN again",
        "lat": 0.3,
        "long": 100.50
    },
    "name": "event",
    "womenOnly": true,
    "spots": 3,
    "addressVisible": true,
    "minimumAge": 16,
    "photoId": true,
    "physical": true,
    "addInfo": true,
    "content": "fun event yay",
    "date": "2004-10-19 10:23:54",
    "userId": 3
    "causes": [1,2,4]
 }
 </pre>
 * "address" can be substituted with <pre>"addressId: {Integer}"</pre> in which case the existing address is reused.
 * @returns {object}
 *  status: 200, description: The event object created with its id and addressId set to the ones stored in the database<br/>
 <pre>
 {
    "message": "Event created successfully",
    "data": {
        "event": {
            "id": 106,
            "name": "event",
            "addressId": 106,
            "womenOnly": true,
            "spots": 3,
            "addressVisible": true,
            "minimumAge": 16,
            "photoId": true,
            "physical": true,
            "addInfo": true,
            "content": "fun event yay",
            "date": "2004-10-19T09:23:54.000Z",
            "userId": 3,
            "pictureId": null,
            "creationDate": "2020-03-21T23:07:18.020Z"
        },
        "causes": [
            {
                "eventId": 106,
                "causeId": 1
            },
            {
                "eventId": 106,
                "causeId": 2
            },
            {
                "eventId": 106,
                "causeId": 3
            }
        ]
    }
}
 </pre>
 *  status: 400, description: User has reached their monthly event creation limit.<br/>
 *  status: 500, description: DB error
 *  @name Create new event
 *  @function
 */
router.post("/", authService.requireAuthentication, async (req, res) => {
    try {
        log.info("User id '%d': Creating new event", req.body.userId);
        const event = req.body;
        const validationResult = validation.validateEvent(event);
        if (validationResult.errors.length > 0) {
            return httpUtil.sendValidationErrors(validationResult, res);
        }
        const eventCreationResult = await eventService.createNewEvent(event);
        return httpUtil.sendResult(eventCreationResult, res);
    } catch (e) {
        log.error("User id '%d': Event creation failed: " + e, req.body.userId);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called whenever a user updates an event.<br/>
 <p><b>Route: </b>/event/update/:id (POST)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {string} req.headers.authorization authToken
 * @param {Event} req.body - Information regarding the event containing the same properties as this example:
 <pre>
 {
    "address": {
        "id": 5,
        "address1": "Line 1",
        "address2": "Line 2",
        "postcode": "14 aa",
        "city": "LDN",
        "region": "LDN again",
        "lat": 0.3,
        "long": 100.50
    },
    "name": "event",
    "womenOnly": true,
    "spots": 3,
    "addressVisible": true,
    "minimumAge": 16,
    "photoId": true,
    "physical": true,
    "addInfo": true,
    "content": "fun event yay",
    "date": "2004-10-19 10:23:54",
    "userId": 3
 }
 </pre>
 * Note that address must have an id.
 * @returns {object}
 *  status: 200, description: The updated event object.<br/>
 <pre>
 {
    "message": "New event created",
    "data": {
        "event": {
            "name": "event",
            "addressId": 5,
            "womenOnly": true,
            "spots": 3,
            "addressVisible": true,
            "minimumAge": 16,
            "photoId": true,
            "physical": true,
            "addInfo": true,
            "content": "fun event yay",
            "date": "2004-10-19 10:23:54",
            "userId": 3,
            "creationDate": "2019-10-19 10:23:54"
        }
    }
 }
 </pre>
 *  status: 500, description: DB error
 *  @function
 *  @name Update event
 */
router.post("/update/:id", authService.requireAuthentication, async (req, res) => {
    try {
        log.info("User id '%d': Updating event id '%d'", req.body.userId, req.params.id);
        const event = {...req.body, id: Number.parseInt(req.params.id)};
        const validationResult = validation.validateEvent(event);
        if (validationResult.errors.length > 0) {
            return httpUtil.sendValidationErrors(validationResult, res);
        }

        const eventUpdateResult = await eventService.updateEvent(event);
        return httpUtil.sendResult(eventUpdateResult, res);
    } catch (e) {
        log.error("User id '%d': Event id '%d' updating failed: " + e, req.body.userId, req.params.id);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called whenever a user deletes an event. <br/>
 <p><b>Route: </b>/event/:id/delete/ (POST)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @returns {object}
 *  status: 200, description: The deleted event object.<br/>
 <pre>
 {
    "message": "New event created",
    "data": {
            event: {
                "name": "event",
                "addressId": 5,
                "womenOnly": true,
                "spots": 3,
                "addressVisible": true,
                "minimumAge": 16,
                "photoId": true,
                "physical": true,
                "addInfo": true,
                "content": "fun event yay",
                "date": "2004-10-19 10:23:54",
                "userId": 3,
                "creationDate": "2019-10-19 10:23:54"
            }
    }
 }
 </pre>
 *  status: 500, description: DB error
 *  @function
 *  @name Delete event
 */
router.post("/:id/delete/", authService.requireAuthentication, async (req, res) => {
    try {
        log.info("User id '%d': Deleting event id '%d'", req.body.userId, req.params.id);
        const eventId = Number.parseInt(req.params.id);
        const eventDeleteResult = await eventService.deleteEvent(eventId);
        return httpUtil.sendResult(eventDeleteResult, res);
    } catch (e) {
        log.error("User id '%d': Deleting event id '%d' failed: " + e, req.body.userId, req.params.id);
        return httpUtil.sendGenericError(e, res);
    }
});

module.exports = router;
