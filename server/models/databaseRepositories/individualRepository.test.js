const db = require("../../database/connection");
const userRepository = require("./userRepository");
const individualRepository = require("./individualRepository");
const addressRepository = require("./addressRepository");
const testHelpers = require("../../test/testHelpers");
const registrationRepository = require("./registrationRepository");

let registrationExample1, userExample1, address, individual;

beforeEach(() => {
    registrationExample1 = testHelpers.getRegistrationExample1();
    userExample1 = testHelpers.getUserExample1();
    address = testHelpers.getAddress();
    individual = testHelpers.getIndividual();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    userExample1.email = "";
    individual.addressId = -1;
    individual.userId = -1;
    return testHelpers.clearDatabase();
});

test('insert individual and findById individual work', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);
    const findIndividualResult = await individualRepository.findById(insertIndividualResult.rows[0].id);
    expect(insertIndividualResult.rows[0]).toMatchObject(findIndividualResult.rows[0]);
});