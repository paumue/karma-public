const Validator = require('jsonschema').Validator;
const validator = new Validator();


/**
 * If a validation fails, the return value of the validator has a property error
 * which consists of ValidationErrors like the following example:
 * errors: [
 ValidationError {
          property: 'instance.lat',
          message: 'must have a maximum value of 90',
          schema: [Object],
          instance: 251.523774,
          name: 'maximum',
          argument: 90,
          stack: 'instance.lat must have a maximum value of 90'
        }
 ],
 */

/**
 * Custom validation errors (from our project semantics) can be added by pushing properly initialized
 * new ValidationError()-s onto the errors array.
 */

const addressSchema = {
    "id": "/Address",
    "type": "object",
    "properties": {
        "id": {"type": "number"},
        "address1": {"type": "string"},
        "address2": {"type": "string"},
        "postcode": {"type": "string"},
        "city": {"type": "string"},
        "region": {"type": "string"},
        "lat": {"type": "number", "minimum": -90, "maximum": 90},
        "long": {"type": "number", "minimum": -180, "maximum": 180},
    },
    "required": ["address1", "address2", "postcode", "city", "region", "lat", "long"],
};


const eventSchema = {
    "id": "/Event",
    "type": "object",
    "properties": {
        "id": {"type": "number"},
        "name": {"type": "string"},
        "addressId": {"type": "number"},
        "womenOnly": {"type": "boolean"},
        "spots": {"type": "number", "minimum": 0},
        "addressVisible": {"type": "boolean"},
        "minimumAge": {"type": "number", "minimum": 0},
        "pictureId": {"type": "boolean"},
        "physical": {"type": "boolean"},
        "addInfo": {"type": "boolean"},
        "content": {"type": "string"},
        "date": {"type": ["string", "date-time"]}, // allow both strings and Dates
        "userId": {"type": "number"},
        "creationDate": {"type": ["string", "date-time"]},
        "address": {"$ref": "/Address"},
    },
    "required": ["name", "womenOnly", "spots", "addressVisible", "minimumAge", "pictureId",
        "physical", "addInfo", "content", "date", "userId"],
};

const notificationSchema = {
    "id": "/Notification",
    "type": "object",
    "properties": {
        "id": {"type": "number"},
        "type": {"type": "string"},
        "message": {"type": "string"},
        "timestampSent": {"type": "date-time"},
        "senderId": {"type": "number"},
        "receiverIds": {"type": "array", "items": {"type": "number"}},
        "receiverId": {"type": "number"},
    },
    "required": ["type", "message", "senderId"],
    "oneOf": [
        {
            "required": [
                "receiverId",
            ],
        },
        {
            "required": [
                "receiverIds",
            ],
        }],
};

const favouriteSchema = {
    "id": "/Favourite",
    "type": "object",
    "properties": {
        "individualId": {"type": "number"},
        "eventId": {"type": "number"},
    },
    "required": ["individualId", "eventId"],
};

const signupSchema = {
    "id": "/Signup",
    "type": "object",
    "properties": {
        "individualId": {"type": "number"},
        "eventId": {"type": "number"},
        "confirmed": {"type": "boolean"},
    },
    "required": ["individualId", "confirmed"],
};

const informationSchema = {
    "id": "/Information",
    "type": "object",
    "properties": {
        "type": {"type": "string"},
        "content": {"type": "string"},
    },
    "required": ["type", "content"],
};

const individualSchema = {
    "id": "/Individual",
    "type": "object",
    "properties": {
        "id": {"type": "number"},
        "firstname": {"type": "string"},
        "lastname": {"type": "string"},
        "phone": {"type": "string"},
        "banned": {"type": "boolean"},
        "userId": {"type": "number"},
        "pictureId": {"type": ["number", "null"]},
        "addressId": {"type": "number"},
        "birthday": {"type": ["string", "date-time"]},
        "gender": {"type": "string"},
    },
    "required": ["firstname", "lastname", "phone", "banned", "birthday", "gender"],
};

validator.addSchema(addressSchema, "/Address");
validator.addSchema(eventSchema, "/Event");
validator.addSchema(notificationSchema, "/Notification");
validator.addSchema(favouriteSchema, "/Favourite");
validator.addSchema(signupSchema, "/Signup");
validator.addSchema(informationSchema, "/Information");
validator.addSchema(individualSchema, "/Individual");

const validateAddress = (address) => validator.validate(address, addressSchema);

const validateEvent = (event) => validator.validate(event, eventSchema);

const validateNotification = (notification) => validator.validate(notification, notificationSchema);

const validateFavourite = (favourite) => validator.validate(favourite, favouriteSchema);

const validateSignup = (signup) => validator.validate(signup, signupSchema);

const validateInformation = (information) => validator.validate(information, informationSchema);

const validateIndividual = (individual) => validator.validate(individual, individualSchema);

module.exports = {
    validateAddress,
    validateEvent,
    validateNotification,
    validateFavourite,
    validateSignup,
    validateInformation,
    validateIndividual,
};
