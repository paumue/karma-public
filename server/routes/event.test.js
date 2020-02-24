const request = require('supertest');
const app = require('../app');
const testHelpers = require("../test/testHelpers");
const util = require("../util/util");

const addressRepository = require("../models/addressRepository");
const eventRepository = require("../models/eventRepository");

jest.mock("../models/eventRepository");
jest.mock("../models/addressRepository");
jest.mock("../util/util");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

const address = testHelpers.address;
const event = testHelpers.event;
event.organization_id = 1;
event.address_id = 1;


test('creating event with known address works', async () => {
    eventRepository.insert.mockResolvedValue({
        rows: [{
            ...event,
            id: 1
        }]
    });
    const response = await request(app).post("/event").send(event);

    expect(eventRepository.insert).toHaveBeenCalledTimes(1);
    expect(addressRepository.insert).toHaveBeenCalledTimes(0);
    expect(response.body).toMatchObject({
        ...event,
        id: 1
    });
    expect(response.statusCode).toBe(200);
});

test('updating events works', async () => {
    const mockAddress = {
        ...address,
        id: 1
    };
    addressRepository.update.mockResolvedValue({
        rows: [mockAddress]
    });
    eventRepository.update.mockResolvedValue({
        rows: [{
            ...event,
            id: 3
        }]
    });

    const response = await request(app).post("/event/update/3").send({
        event,
        address: mockAddress
    });

    expect(eventRepository.update).toHaveBeenCalledTimes(1);
    expect(addressRepository.update).toHaveBeenCalledTimes(1);
    expect(response.body).toMatchObject({
        ...event,
        id: 3
    });

    expect(response.statusCode).toBe(200);
});

test('requesting specific event data works', async () => {
    eventRepository.findById.mockResolvedValue({
        rows: [{
            ...event,
            id: 3
        }]
    });
    addressRepository.findById.mockResolvedValue({
        rows: [address]
    });
    const response = await request(app).get("/event/3");

    expect(eventRepository.findById).toHaveBeenCalledTimes(1);
    expect(eventRepository.findById).toHaveBeenCalledWith("3");
    expect(addressRepository.findById).toHaveBeenCalledWith(event.address_id);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
        ...event,
        id: 3
    });
});

test('error returned when user tries to exceed monthly event creation limit', async () => {
    util.isIndividual.mockResolvedValue(true);
    eventRepository.findAllByUserId.mockResolvedValue({
        rows: [{}, {}, {}, {}]
    }); // 4 events
    const response = await request(app).post("/event").send(event);
    expect(response.statusCode).toBe(400);
});

test('creating event with no address_id creates new address and event', async () => {
    util.isIndividual.mockResolvedValue(false);
    const eventNoAddressId = {
        ...event
    };
    delete eventNoAddressId.address_id;
    const mockAddress = {
        ...address,
        id: 1
    };
    addressRepository.insert.mockResolvedValue({
        rows: [mockAddress]
    });
    eventRepository.insert.mockResolvedValue({
        rows: [{
            ...event,
            id: 1
        }]
    });

    const response = await request(app).post("/event").send(eventNoAddressId);

    expect(eventRepository.insert).toHaveBeenCalledTimes(1);
    expect(addressRepository.insert).toHaveBeenCalledTimes(1);
    expect(response.body).toMatchObject({
        ...event,
        id: 1
    });
    expect(response.statusCode).toBe(200);
});
