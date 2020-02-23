const addressRepository = require("./addressRepository");
const testHelpers = require("../test/testHelpers");

const address = testHelpers.address;

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert and findById work', async () => {
    const insertResult = await addressRepository.insert(address);
    const findResult = await addressRepository.findById(insertResult.rows[0].id);
    expect(findResult.rows[0]).toMatchObject(insertResult.rows[0]);
});

test('update works', async () => {
    const insertAddressResult = await addressRepository.insert(address);
    const insertedAddress = insertAddressResult.rows[0];
    insertedAddress.city = "Tallinn";
    insertedAddress.lat = "15.3000000";
    const updateEventResult = await addressRepository.update(insertedAddress);
    expect(updateEventResult.rows[0]).toMatchObject(insertedAddress);
});
