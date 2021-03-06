const favouriteRepository = require("../../../repositories/favourite");
const individualRepository = require("../../../repositories/individual");
const util = require("../../../util");
const eventSorter = require("../../sorting");
/**
 * Creates a new event favourite to be added to the database.
 * @param {object} favouriteRequest An object containing a valid individualId and a valid eventId.
 * Fails if eventId is invalid, or database call fails.
 */
const createEventFavourite = async (favouriteRequest) => {
    const eventIdCheckResponse = await util.checkEventId(favouriteRequest.eventId);
    if (eventIdCheckResponse.status !== 200) {
        throw new Error(eventIdCheckResponse.message);
    }

    const favouriteResult = await favouriteRepository.insert(favouriteRequest);
    return ({
        status: 200,
        message: "Favourite added successfully",
        data: {favourite: favouriteResult.rows[0]},
    });
};

/**
 * Delete an event favourite from the database.
 * @param {object} deleteFavouriteRequest An object containing a valid individualId and a valid eventId.
 * Fails if eventId is invalid, or database call fails.
 */
const deleteEventFavourite = async (deleteFavouriteRequest) => {
    const eventIdCheckResponse = await util.checkEventId(deleteFavouriteRequest.eventId);
    if (eventIdCheckResponse.status !== 200) {
        throw new Error(eventIdCheckResponse.message);
    }

    const deleteFavouriteResult = await favouriteRepository.remove(deleteFavouriteRequest);
    return ({
        status: 200,
        message: "Event unfavourited successfully",
        data: {favourite: deleteFavouriteResult.rows[0]},
    });
};


/**
 * Gets data about all events in the database.
 * @param {Number} userId id of the user
 * @return {object} result in httpUtil's sendResult format
 * Fails if database calls fail.
 */
const getFavouriteEvents = async (userId) => {
    const userIdCheckResponse = await util.checkUser(userId);
    if (userIdCheckResponse.status !== 200) {
        throw new Error(userIdCheckResponse.message);
    }

    const findResult = await individualRepository.findFavouriteEvents(userId);
    let events = findResult.rows;
    events = events.map(event => {
        return {...event,
            spotsRemaining: event.spots - (event.volunteers).length,
            going: (event.volunteers).includes(Number.parseInt(userId)),
            favourited: true,
        };
    });
    eventSorter.sortByTime(events);
    return ({
        status: 200,
        message: "Favourite events fetched successfully",
        data: {events: events},
    });
};

module.exports = {
    createEventFavourite,
    deleteEventFavourite,
    getFavouriteEvents,
};
