const db = require("../database/connection");

const insert = (event) => {
    const query = "INSERT INTO event(name, organisation_id, address_id, women_only, spots, address_visible, minimum_age, " +
        "photo_id, physical, add_info, content, date, time) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) " +
        "RETURNING *"; // returns passed event with it's id set to corresponding id in database
    const params = [event.name, event.organisation_id, event.address_id, event.women_only, event.spots, event.address_visible,
        event.minimum_age, event.photo_id, event.physical, event.add_info, event.content, event.date, event.time,
    ];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM event WHERE id=$1";
    return db.query(query, [id]);
};

const update = (event) => {
    const query = "UPDATE event SET name = $1, women_only = $2, spots = $3, address_visible = $4, minimum_age = $5, " +
        "photo_id = $6, physical = $7, add_info = $8, content = $9, date = $10, time = $11 WHERE id = $12" +
        "RETURNING *"; // returns passed event with it's id set to corresponding id in database
    const params = [event.name, event.women_only, event.spots, event.address_visible, event.minimum_age, event.photo_id,
        event.physical, event.add_info, event.content, event.date, event.time, event.id,
    ];
    return db.query(query, params);
};

const getAll = () => {
    const query = "SELECT * FROM event";
    return db.query(query);
};
const getEventsWithLocation = () => {
    const query = "select id(event),lat,long from address left join event on id(address) = address_id";
    return db.query(query);
};
module.exports = {
    insert: insert,
    findById: findById,
    update: update,
    getAll: getAll,
    getEventsWithLocation: getEventsWithLocation,
};
