const express = require('express');
const router = express.Router();
const addressRepository = require("../models/addressRepository");
const eventRepository = require("../models/eventRepository");
const userRepository = require("../models/userRepository");
const selectedCauseRepository = require("../models/selectedCauseRepository");
const eventSorter = require("../sorting/event");
const paginator = require("../pagination");

router.post('/', (req, res) => {
    const address = req.body.address;
    let eventPromise;
    if (!req.body.address_id) { // address doesn't exist in database yet
        eventPromise = addressRepository.insert(address)
            .then(addressResult => {
                const event = {
                    ...req.body,
                    address_id: addressResult.rows[0].id,
                };
                return eventRepository.insert(event);
            });
    } else {
        eventPromise = eventRepository.insert(req.body);
    }
    eventPromise.then(eventResult => res.status(200).send(eventResult.rows[0]))
        .catch(err => res.status(500).send(err));
});

router.post('/update', (req, res) => {
    const address = req.body.address;
    const event = req.body;
    addressRepository.update(address)
        .then(addressResult => eventRepository.update(event))
        .then(eventResult => res.status(200).send(eventResult.rows[0]))
        .catch(err => res.status(500).send(err));
});


/**
 * endpoint called when "All" tab is pressed in Activities homepage
 * URL example: http://localhost:8000/event?userId=1&currentPage=1&pageSize=2
 * route {GET} /event
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {integer} req.query.userId - ID of user logged in
 * @returns:
 *  status: 200, description: Array of all event objects sorted by time
 *  and distance from the user (distance measured in miles), along with pagination information as follows:
 * {
 *  "meta": {
 *     "currentPage": 2,
 *       "pageCount": 1,
 *       "pageSize": 2,
 *       "count": 4
 *   },
 *   "data": [
 *       {
 *           "event_id": 1,
 *           "name": "Community help centre",
 *           "women_only": false,
 *           "spots": 3,
 *           "address_visible": true,
 *           "minimum_age": 18,
 *           "photo_id": false,
 *           "physical": false,
 *           "add_info": true,
 *           "content": "help people at the community help centre because help is good",
 *           "date": "2020-03-25T19:10:00.000Z",
 *           "event_creator_id": 1,
 *           "address_1": "nearby road",
 *           "address_2": null,
 *           "postcode": "whatever",
 *           "city": "London",
 *           "region": null,
 *           "lat": "51.4161220",
 *           "long": "-0.1866410",
 *            "distance": 0.18548890708299523
 *       },
 *       {
 *           "event_id": 2,
 *           "name": "Picking up trash",
 *           "women_only": false,
 *           "spots": 5,
 *           "address_visible": true,
 *           "minimum_age": 18,
 *           "photo_id": false,
 *           "physical": false,
 *           "add_info": true,
 *           "content": "small class to teach other people how to pick themselves up",
 *           "date": "2020-03-25T19:10:00.000Z",
 *           "event_creator_id": 1,
 *           "address_1": "uni road",
 *           "address_2": null,
 *           "postcode": "whatever",
 *           "city": "London",
 *           "region": null,
 *           "lat": "51.5114070",
 *           "long": "-0.1159050",
 *           "distance": 7.399274608089304
 *       }
 *   ]
 * }
 *  status: 400, description: if userID param is not specified or in wrong format/NaN
 *  status: 404, description: if userID doesnt belong to any user
 *  status: 500, description: Most probably a database error occured
 */
router.get('/', async (req, res) => {
    const userId = req.query.userId;

    if (!userId) return res.status(400).send("No user id was specified in the query");
    if (isNaN(userId)) return res.status(400).send("ID specified is in wrong format");

    const userResult = await userRepository.getUserLocation(userId);
    const user = userResult.rows[0];
    if (!user) return res.status(404).send("No user with specified id");

    eventRepository.getEventsWithLocation()
        .then(result => {
            const events = result.rows;
            if (events.length === 0) return res.status(404).send("No events");
            eventSorter.sortByTime(events);
            eventSorter.sortByDistanceFromUser(events, user);
            res.status(200).json(paginator.getPageData(req, events));
        })
        .catch(err => res.status(500).send(err));
});

/**
 * route {GET} event/causes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {integer} req.query.userId - ID of user logged in
 * @returns:
 *  status: 200, description: Array of all event objects grouped by causes that were selected by user
 *  Each cause group is sorted by time and distance from the user (distance measured in miles) as follows:
 * {
    "peace": [
        {
            "id": 3,
            "name": "Staying at Home",
            "address_id": 1,
            "women_only": false,
            "spots": 1,
            "address_visible": true,
            "minimum_age": 18,
            "photo_id": false,
            "add_info": false,
            "content": "sleeping at home",
            "date": "2020-03-25T19:10:00.000Z",
            "cause_id": 3,
            "cause_name": "peace",
            "cause_description": "not dealing with people",
            "event_creator_id": 1,
            "address_1": "pincot road",
            "address_2": null,
            "postcode": "SW19 2LF",
            "city": "London",
            "region": null,
            "lat": "51.4149160",
            "long": "-0.1904870",
            "distance": 0
        }
    ],
    "gardening": [
        {
            "id": 1,
            "name": "Close to Home",
            "address_id": 3,
            "women_only": false,
            "spots": 3,
            "address_visible": true,
            "minimum_age": 18,
            "photo_id": false,
            "add_info": false,
            "content": "very very close from home",
            "date": "2020-03-25T19:10:00.000Z",
            "cause_id": 1,
            "cause_name": "gardening",
            "cause_description": "watering plants and dat",
            "event_creator_id": 1,
            "address_1": "nearby road",
            "address_2": null,
            "postcode": "whatever",
            "city": "London",
            "region": null,
            "lat": "51.4161220",
            "long": "-0.1866410",
            "distance": 0.18548890708299523
        }
    ]
}
 *  status: 400, description: if userID param is not specified or in wrong format/NaN
 *  status: 404, description: if userID doesnt belong to any user
 *  status: 500, description: Most probably a database error occured
 */
router.get('/causes', async (req, res) => {
    const userId = req.query.userId;

    if (!userId) return res.status(400).send("No user id was specified in the query");
    if (isNaN(userId)) return res.status(400).send("ID specified is in wrong format");

    const userResult = await userRepository.getUserLocation(userId);
    const user = userResult.rows[0];
    if (!user) return res.status(404).send("No user with specified id");

    selectedCauseRepository.findEventsSelectedByUser(userId)
        .then(result => {
            const events = result.rows;
            if (events.length === 0) return res.status(404).send("No causes selected by user");
            eventSorter.sortByTime(events);
            eventSorter.sortByDistanceFromUser(events, user);
            res.status(200).json(eventSorter.groupByCause(events));
        })
        .catch(err => res.status(500).send(err));
});

module.exports = router;
