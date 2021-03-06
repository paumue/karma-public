const request = require("supertest");
const app = require("../../app");
const testHelpers = require("../../test/helpers");
const userRepo = require("../../repositories/user");
const regRepo = require("../../repositories/registration");
const authService = require("../../modules/authentication/");

const user = testHelpers.getUserExample4();
const registration = testHelpers.getRegistrationExample5();

beforeEach(() => {
    process.env.SKIP_PASSWORD_CHECKS = 0;
    process.env.NO_AUTH = 1;
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

const registerIndividualRequest = {
    userId: 666,
    data: {
        individual: {
            title: "Mr.",
            firstName: "Paul",
            lastName: "Muller",
            dateOfBirth: "1998-10-09",
            gender: "M",
            phoneNumber: "+435958934",
            address: {
                addressLine1: "abc str",
                addressLine2: "nop",
                townCity: "London",
                countryState: "UK",
                postCode: "NW1 6XE",
            },
        },
    },
};

const profileViewRequest = {
    userId: 99999999999999999,
};

test("viewing my own profile works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    registerIndividualRequest.userId = userId;

    const response = await request(app)
        .post("/signup/individual")
        .send(registerIndividualRequest);

    expect(response.body.message).toBe("Individual registration successful.");
    expect(response.statusCode).toBe(200);

    const authToken = authService.logInUser(userId);

    process.env.NO_AUTH = 0;
    const profileResponse = await request(app)
        .get(`/profile`)
        .set("authorization", authToken)
        .send(); // otherUserId is undefined

    expect(profileResponse.body.message).toBe(
        "Found individual profile for user.",
    );
    expect(profileResponse.body.data.individual.address.postCode).toBe(registerIndividualRequest.data.individual.address.postCode);
    expect(profileResponse.body.data.individual.firstName).toBe(
        registerIndividualRequest.data.individual.firstName,
    );
    expect(profileResponse.body.data.individual.lastName).toBe(
        registerIndividualRequest.data.individual.lastName,
    );
    expect(Date(profileResponse.body.data.individual.dateOfBirth)).toBe(
        Date(registerIndividualRequest.data.individual.dateOfBirth),
    );
    expect(profileResponse.body.data.individual.gender).toBe(registerIndividualRequest.data.individual.gender);
    expect(profileResponse.body.data.individual.phoneNumber).toBe(
        registerIndividualRequest.data.individual.phoneNumber,
    );
    expect(profileResponse.body.data.individual.address.addressLine1).toBe(
        registerIndividualRequest.data.individual.address.addressLine1,
    );
    expect(profileResponse.body.data.user.username).toBe(user.username);
    expect(profileResponse.body.data.user.email).toBe(registration.email);
    expect(profileResponse.statusCode).toBe(200);
});

test("viewing some else's profile works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    registerIndividualRequest.userId = userId;

    const response = await request(app)
        .post("/signup/individual")
        .send(registerIndividualRequest);

    expect(response.body.message).toBe("Individual registration successful.");
    expect(response.statusCode).toBe(200);

    profileViewRequest.userId = userId;
    const profileResponse = await request(app)
        .get(`/profile?otherUserId=${profileViewRequest.userId}`);

    expect(profileResponse.body.message).toBe(
        "Found individual profile for user.",
    );
    expect(profileResponse.body.data.individual.address.postCode).toBe(registerIndividualRequest.data.individual.address.postCode);
    expect(profileResponse.body.data.individual.firstName).toBe(
        registerIndividualRequest.data.individual.firstName,
    );
    expect(profileResponse.body.data.individual.lastName).toBe(
        registerIndividualRequest.data.individual.lastName,
    );
    expect(Date(profileResponse.body.data.individual.dateOfBirth)).toBe(
        Date(registerIndividualRequest.data.individual.dateOfBirth),
    );
    expect(profileResponse.body.data.individual.gender).toBe(registerIndividualRequest.data.individual.gender);
    expect(profileResponse.body.data.individual.phoneNumber).toBe(
        registerIndividualRequest.data.individual.phoneNumber,
    );
    expect(profileResponse.body.data.individual.address.addressLine1).toBe(
        registerIndividualRequest.data.individual.address.addressLine1,
    );
    expect(profileResponse.body.data.user.username).toBe(user.username);
    expect(profileResponse.body.data.user.email).toBe(registration.email);
    expect(profileResponse.statusCode).toBe(200);
});

const organisationRegistrationRequest = {
    userId: 420,
    data: {
        organisation: {
            organisationNumber: "69",
            name: "Karma org",
            organisationType: "c",
            lowIncome: "no",
            exempt: "no",
            pocFirstName: "Paul",
            pocLastName: "Muller",
            address: {
                addressLine1: "Karma str",
                addressLine2: "n",
                townCity: "London",
                countryState: "UK",
                postCode: "WC 23",
            },
            phoneNumber: "+44343525",
        },
    },
};

test("viewing org profile works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    organisationRegistrationRequest.userId = userId;

    const response = await request(app)
        .post("/signup/organisation")
        .send(organisationRegistrationRequest);

    expect(response.body.message).toBe("Organisation registration successful.");
    expect(response.statusCode).toBe(200);

    profileViewRequest.userId = userId;
    const profileResponse = await request(app)
        .get(`/profile?userId=${profileViewRequest.userId}`);

    expect(profileResponse.body.message).toBe(
        "Found organisation profile for user.",
    );
    expect(profileResponse.body.data.organisation.address.postCode).toBe(
        organisationRegistrationRequest.data.organisation.address.postCode,
    );
    expect(profileResponse.body.data.organisation.organisationNumber).toBe(
        organisationRegistrationRequest.data.organisation.organisationNumber,
    );
    expect(profileResponse.body.data.user.username).toBe(user.username);
    expect(profileResponse.body.data.user.email).toBe(registration.email);
    expect(profileResponse.statusCode).toBe(200);
});

test("viewing profile without user account works", async () => {
    const profileResponse = await request(app)
        .get(`/profile?userId=${profileViewRequest.userId}`);

    expect(profileResponse.statusCode).toBe(400);
    expect(profileResponse.body.message).toBe(
        "Cannot read property 'username' of undefined",
    );
});

test("viewing profile without indiv or org account works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    profileViewRequest.userId = userId;
    const profileResponse = await request(app)
        .get(`/profile?userId=${userId}`);

    expect(profileResponse.statusCode).toBe(400);
    expect(profileResponse.body.message).toBe(
        "Cannot read property 'addressId' of undefined",
    );
});
