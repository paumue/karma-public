const addressRepository = require("./addressRepository");
const eventRepository = require("./eventRepository");
const testHelpers = require("../test/testHelpers");
const userRepository = require("./userRepository");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert and findById work', async () => {
    const address = testHelpers.address;
    const event = testHelpers.event;
    const user = testHelpers.user;
    const insertAddressResult = await addressRepository.insert(address);
    const insertUserResult = await userRepository.insert(user);
    event.address_id =  insertAddressResult.rows[0].id;
    event.user_id = insertUserResult.rows[0].id;
    const insertEventResult = await eventRepository.insert(event);
    const findEventResult = await eventRepository.findById(insertEventResult.rows[0].id);
    expect(findEventResult.rows[0]).toMatchObject(insertEventResult.rows[0]);
});

test('update works', async () => {
    const address = testHelpers.address;
    const event = testHelpers.event;
    const user = testHelpers.user;
    const insertAddressResult = await addressRepository.insert(address);
    const insertUserResult = await userRepository.insert(user);
    event.address_id =  insertAddressResult.rows[0].id;
    event.user_id = insertUserResult.rows[0].id;

    const insertEventResult = await eventRepository.insert(event);
    const insertedEvent = insertEventResult.rows[0];
    insertedEvent.name = "New name";
    insertedEvent.spots = 5;
    const updateEventResult = await eventRepository.update(insertedEvent);
    expect(updateEventResult.rows[0]).toMatchObject(insertedEvent);
});