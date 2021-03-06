const testHelpers = require("../../../test/helpers");
const selectedCauseRepository = require("./");
const causeRepository = require("../");
const userRepository = require("../../user");
const registrationRepository = require("../../registration");
const eventRepository = require("../../event");
const addressRepository = require("../../address");
const eventCauseRepository = require("../../event/cause");

let registrationExample3, cause, userExample3, cause1, cause2, event, address, eventCause;

beforeEach(() => {
    registrationExample3 = testHelpers.getRegistrationExample3();
    cause = testHelpers.getCause();
    cause1 = testHelpers.getCauseExample1();
    cause2 = testHelpers.getCauseExample2();
    userExample3 = testHelpers.getUserExample3();
    event = testHelpers.getEvent();
    address = testHelpers.getAddress();
    eventCause = testHelpers.getEventCauseExample1();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample3);
    userExample3.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample3);
    const insertCauseResult = await causeRepository.insert(cause);
    const userId = insertUserResult.rows[0].id;
    const causeId = insertCauseResult.rows[0].id;
    const insertResult = await selectedCauseRepository.insert(userId, causeId);
    expect(insertResult.rows[0]).toMatchObject({
        userId: userId,
        causeId: causeId
    });
});

test('insert Multiple works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample3);
    userExample3.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample3);
    const insertCauseResult = await causeRepository.insert(cause);
    const insertCauseResult1 = await causeRepository.insert(cause1);
    const insertCauseResult2 = await causeRepository.insert(cause2);
    const userId = insertUserResult.rows[0].id;
    const causeId = insertCauseResult.rows[0].id;
    const causeId1 = insertCauseResult1.rows[0].id;
    const causeId2 = insertCauseResult2.rows[0].id;
    const insertResult = await selectedCauseRepository.insertMultiple(userId, [causeId, causeId1, causeId2]);
    expect(insertResult.rows[0]).toMatchObject({
        userId: userId,
        causeId: causeId
    });
    expect(insertResult.rows[1]).toMatchObject({
        userId: userId,
        causeId: causeId1
    });
    expect(insertResult.rows[2]).toMatchObject({
        userId: userId,
        causeId: causeId2
    });
});

test('deleteUnselected works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample3);
    userExample3.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample3);
    const insertCauseResult = await causeRepository.insert(cause);
    const insertCauseResult1 = await causeRepository.insert(cause1);
    const insertCauseResult2 = await causeRepository.insert(cause2);
    const userId = insertUserResult.rows[0].id;
    const causeId = insertCauseResult.rows[0].id;
    const causeId1 = insertCauseResult1.rows[0].id;
    const causeId2 = insertCauseResult2.rows[0].id;
    await selectedCauseRepository.insertMultiple(userId, [causeId, causeId1, causeId2]);
    await selectedCauseRepository.deleteUnselected(userId, [causeId1]);
    const findByUserIdResult = await selectedCauseRepository.findByUserId(userId);
    expect(findByUserIdResult.rows[0]).toMatchObject({
        userId: userId,
        causeId: causeId1
    });
    expect(findByUserIdResult.rowCount).toBe(1);
});

test('unselectAll works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample3);
    userExample3.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample3);
    const insertCauseResult = await causeRepository.insert(cause);
    const insertCauseResult1 = await causeRepository.insert(cause1);
    const insertCauseResult2 = await causeRepository.insert(cause2);
    const userId = insertUserResult.rows[0].id;
    const causeId = insertCauseResult.rows[0].id;
    const causeId1 = insertCauseResult1.rows[0].id;
    const causeId2 = insertCauseResult2.rows[0].id;
    await selectedCauseRepository.insertMultiple(userId, [causeId, causeId1, causeId2]);
    await selectedCauseRepository.unselectAll(userId);
    const findByUserIdResult = await selectedCauseRepository.findByUserId(userId);
    expect(findByUserIdResult.rowCount).toBe(0);
});

test('deleteMultiple works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample3);
    userExample3.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample3);
    const insertCauseResult = await causeRepository.insert(cause);
    const insertCauseResult1 = await causeRepository.insert(cause1);
    const insertCauseResult2 = await causeRepository.insert(cause2);
    const userId = insertUserResult.rows[0].id;
    const causeId = insertCauseResult.rows[0].id;
    const causeId1 = insertCauseResult1.rows[0].id;
    const causeId2 = insertCauseResult2.rows[0].id;
    await selectedCauseRepository.insertMultiple(userId, [causeId, causeId1, causeId2]);
    await selectedCauseRepository.deleteMultiple(userId, [causeId1, causeId2]);
    const findByUserIdResult = await selectedCauseRepository.findByUserId(userId);
    expect(findByUserIdResult.rows[0]).toMatchObject({
        userId: userId,
        causeId: causeId
    });
    expect(findByUserIdResult.rowCount).toBe(1);
});

test('find works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample3);
    userExample3.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample3);
    const insertCauseResult = await causeRepository.insert(cause);
    const userId = insertUserResult.rows[0].id;
    const causeId = insertCauseResult.rows[0].id;
    const insertResult = await selectedCauseRepository.insert(userId, causeId);
    const findResult = await selectedCauseRepository.find(userId, causeId);
    const findByCauseIdResult = await selectedCauseRepository.findByCauseId(causeId);
    const findByUserIdResult = await selectedCauseRepository.findByUserId(userId);
    expect(findResult.rows[0]).toMatchObject(insertResult.rows[0]);
    expect(findByCauseIdResult.rows[0]).toMatchObject(insertResult.rows[0]);
    expect(findByUserIdResult.rows[0]).toMatchObject(insertResult.rows[0]);
});

test('find EventsSelectedByUser works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample3);
    userExample3.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample3);
    const insertCauseResult = await causeRepository.insert(cause);
    const userId = insertUserResult.rows[0].id;
    const causeId = insertCauseResult.rows[0].id;
    const insertAddress = await addressRepository.insert(address);
    event.date = '2030-10-19 10:23:54';
    event.addressId = insertAddress.rows[0].id;
    event.userId = userId;
    const insertEvent = await eventRepository.insert(event);
    eventCause.eventId = insertEvent.rows[0].id;
    eventCause.causeId = causeId;
    await eventCauseRepository.insert(eventCause);
    await selectedCauseRepository.insert(userId, causeId);
    const findResult = await selectedCauseRepository.findEventsSelectedByUser(userId, "");
    expect(findResult.rowCount).toBe(1);
    expect(findResult.rows[0].eventId).toBe(insertEvent.rows[0].id);
    expect(findResult.rows[0].postcode).toBe(address.postcode);
});

test('find EventsSelectedByUser works with where clause', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample3);
    userExample3.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample3);
    const insertCauseResult = await causeRepository.insert(cause);
    const userId = insertUserResult.rows[0].id;
    const causeId = insertCauseResult.rows[0].id;
    const insertAddress = await addressRepository.insert(address);
    event.date = '2030-10-19 10:23:54';
    event.addressId = insertAddress.rows[0].id;
    event.userId = userId;
    event.womenOnly = true;
    const insertEvent = await eventRepository.insert(event);
    eventCause.eventId = insertEvent.rows[0].id;
    eventCause.causeId = causeId;
    await eventCauseRepository.insert(eventCause);
    await selectedCauseRepository.insert(userId, causeId);
    const findResult = await selectedCauseRepository.findEventsSelectedByUser(userId, " where women_only = true");
    expect(findResult.rowCount).toBe(1);
    expect(findResult.rows[0].eventId).toBe(insertEvent.rows[0].id);
    expect(findResult.rows[0].postcode).toBe(address.postcode);
});

test('remove by UserId works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample3);
    userExample3.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample3);
    const insertCauseResult = await causeRepository.insert(cause);
    const userId = insertUserResult.rows[0].id;
    const causeId = insertCauseResult.rows[0].id;
    await selectedCauseRepository.insert(userId, causeId);
    const findResult = await selectedCauseRepository.find(userId, causeId);
    const removeResult = await selectedCauseRepository.removeByUserId(userId);
    const findResultUserId = await selectedCauseRepository.findByUserId(userId);
    expect(findResult.rows[0]).toMatchObject(removeResult.rows[0]);
    expect(findResultUserId.rowCount).toBe(0);
});
