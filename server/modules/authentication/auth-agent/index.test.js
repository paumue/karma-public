const authAgent = require("./");
const testHelpers = require("../../../test/testHelpers");
const userRepo = require("../../../models/databaseRepositories/userRepository");
const regRepo = require("../../../models/databaseRepositories/registrationRepository");
const indivRepo = require("../../../models/databaseRepositories/individualRepository");
const addressRepo = require("../../../models/databaseRepositories/addressRepository");
const authRepo = require("../../../models/databaseRepositories/authenticationRepository");
const profileRepo = require("../../../models/databaseRepositories/profileRepository");
const causeRepo = require("../../../models/databaseRepositories/causeRepository");
const request = require("supertest");
const app = require("../../../app");
const jose = require("../../jose");

const user = testHelpers.getUserExample4();
const profile = testHelpers.getProfile();
const registration = testHelpers.getRegistrationExample4();

jest.mock("../../../models/databaseRepositories/causeRepository");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});


test("log-in works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logIn(userId);
    expect(jose.verifyAndGetUserId(authToken)).toStrictEqual(userId);
});

const cause = testHelpers.cause;

test("visiting an internal route with a valid token works", async () => {
    causeRepo.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const profileViewRequest = {
        // no userId specified!!!
        authToken: "toBeReceived",
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logIn(userId);
    expect(jose.verifyAndGetUserId(authToken)).toStrictEqual(userId);
    profileViewRequest.authToken = authToken;

    const response = await request(app)
        .get("/causes")
        .send(profileViewRequest)
        .redirects(0);

    expect(causeRepo.findAll).toHaveBeenCalledTimes(1)
    expect(response.body.data).toMatchObject([{
        ...cause,
        id: 1,
    }]);
});

test("visiting an internal route with a missing token fails as expected", async () => {
    causeRepo.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const profileViewRequest = {
        // no userId specified!!!
        // no authToken specified!!!
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logIn(userId);
    expect(jose.verifyAndGetUserId(authToken)).toStrictEqual(userId);

    const response = await request(app)
        .get("/causes")
        .send(profileViewRequest)
        .redirects(1);

    expect(response.body.message).toBe("No authToken specified in incoming request.");
    expect(response.statusCode).toBe(400);
});

test("visiting an internal route with a null token fails as expected", async () => {
    causeRepo.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const profileViewRequest = {
        // no userId specified!!!
        authToken: null,
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logIn(userId);
    expect(jose.verifyAndGetUserId(authToken)).toStrictEqual(userId);

    const response = await request(app)
        .get("/causes")
        .send(profileViewRequest)
        .redirects(1);

    expect(response.body.message).toBe("Cannot read property 'split' of null");
    expect(response.statusCode).toBe(401);
});

test("visiting an internal route with a forged token sig fails as expected", async () => {
    causeRepo.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const profileViewRequest = {
        // no userId specified!!!
        authToken: "eyJ0eXAiOiJKV1QiLCJraWQiOiJWR0tEUGY4RHhvWU04U2FEZVBudm5JS0tENWh1SVF0eV8zOU1BaTQyYURrIiwiYWxnIjoiRVMyNTYifQ.eyJzdWIiOiI1MjYiLCJhdWQiOiIvdXNlciIsImlzcyI6Imh0dHA6Ly9rYXJtYS5sYWFuZS54eXovIiwiaWF0IjoxNTg0NTYyMjEzLCJleHAiOjE1ODcxNTQyMTN9.FORGED",
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logIn(userId);
    expect(jose.verifyAndGetUserId(authToken)).toStrictEqual(userId);

    const response = await request(app)
        .get("/causes")
        .send(profileViewRequest)
        .redirects(1);

    expect(response.body.message).toBe("signature verification failed");
    expect(response.statusCode).toBe(401);
});

test("visiting an internal route with a forged token body or header fails as expected", async () => {
    causeRepo.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const profileViewRequest = {
        // no userId specified!!!
        authToken: "eyJ0eXAiOiJKV1QiLCJraWQiOiIxdFU1Z3FxQkhLREV5RHg3SHJrQkE5aVhIQlNmTkZtYV9vRmZhWHd0N2trIiwiYWxnIjoiRVMyNTYifQ.FORGED.KNkhgTIU4WES-pw4Yi6u7KYAldMdnS256IcgnEy0HfKLJv3fsPHqunesaY5EsP7MzLFmf-sU1wo1wztO1E7x1w",
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logIn(userId);
    expect(jose.verifyAndGetUserId(authToken)).toStrictEqual(userId);

    const response = await request(app)
        .get("/causes")
        .send(profileViewRequest)
        .redirects(1);

    expect(response.body.message).toBe("JWT is malformed");
    expect(response.statusCode).toBe(401);

    const profileViewRequest2 = {
        // no userId specified!!!
        authToken: "FORGED.eyJzdWIiOiI1NDEiLCJhdWQiOiIvdXNlciIsImlzcyI6Imh0dHA6Ly9rYXJtYS5sYWFuZS54eXovIiwiaWF0IjoxNTg0NTYyMzMyLCJleHAiOjE1ODcxNTQzMzJ9.w8wHlcIs0JOiMtMeAtcT4G826tTfv64WKbVCaJG-fLp6kCtHpjbqPsI-zewSpdf6onxoe1PPrj1FkFuPwCz3Lw",
    };

    const response2 = await request(app)
        .get("/causes")
        .send(profileViewRequest2)
        .redirects(1);

    expect(response2.body.message).toBe("JWT is malformed");
    expect(response2.statusCode).toBe(401);
});

test("visiting an internal route with a fully forged token fails as expected", async () => {
    causeRepo.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const profileViewRequest = {
        // no userId specified!!!
        authToken: "eyJ0eXAiOiJKV1QiLCJraWQiOiJ1VDNhMTliWTRkemRKMW9Yd0E2MUJRUzRJSTdiOU1HbVI0Ul9aNTBPejg0IiwiYWxnIjoiRVMyNTYifQ.eyJzdWIiOiI1NjUiLCJhdWQiOiIvdXNlciIsImlzcyI6Imh0dHA6Ly9rYXJtYS5sYWFuZS54eXovIiwiaWF0IjoxNTg0NTYyNDgxLCJleHAiOjE1ODcxNTQ0ODF9.auy - IW3zmO6obFKkZ1Vby5H2c8osJY2CtKUSRu60ZKtU8ST - v57v9x3b2ctTuKkEEnAEPi_jJtKqybnsy1d6XA",
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logIn(userId);
    expect(jose.verifyAndGetUserId(authToken)).toStrictEqual(userId);

    const response = await request(app)
        .get("/causes")
        .send(profileViewRequest)
        .redirects(1);

    expect(response.body.data).toBe(undefined);
    expect(response.body.message).toBe("signature verification failed");
    expect(response.statusCode).toBe(401);
});

test("visiting a no-auth route un-authenticated with null token works", async () => {
    const signUpEmailReq = {
        // no userId specified!!!
        authToken: null,
        data: {
            email: "abc@gmail.com",
        },
    };

    const response = await request(app)
        .post("/signin/email")
        .send(signUpEmailReq)
        .redirects(0);

    expect(response.body.message).toBe("Email did not exist. Email successfully recorded, wait for user to input email verification code.");
    expect(response.statusCode).toBe(200);
});

test("visiting a no-auth route un-authenticated with invalid token works", async () => {
    const signUpEmailReq = {
        // no userId specified!!!
        authToken: "invalid",
        data: {
            email: "abc@gmail.com",
        },
    };

    const response = await request(app)
        .post("/signin/email")
        .send(signUpEmailReq)
        .redirects(0);

    expect(response.body.message).toBe("Email did not exist. Email successfully recorded, wait for user to input email verification code.");
    expect(response.statusCode).toBe(200);
});

test("visiting a no-auth route un-authenticated with missing token fails as expected", async () => {
    const signUpEmailReq = {
        // no userId specified!!!
        data: {
            email: "abc@gmail.com",
        },
    };

    const response = await request(app)
        .post("/signin/email")
        .send(signUpEmailReq)
        .redirects(1);

    expect(response.body.message).toBe("No authToken specified in incoming request.");
    expect(response.statusCode).toBe(400);
});

test("visiting a no-auth route already authenticated redirects as expected", async () => {
    const signUpEmailReq = {
        // no userId specified!!!
        authToken: null,
        data: {
            email: "anything, I'm already auth anyways",
        },
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logIn(userId);
    expect(jose.verifyAndGetUserId(authToken)).toStrictEqual(userId);
    signUpEmailReq.authToken = authToken;

    const response = await request(app)
        .post("/signin/email")
        .send(signUpEmailReq)
        .redirects(1);

    expect(response.body.message).toBe("Request is already authenticated.");
    expect(response.statusCode).toBe(200);
    expect(response.body.data.alreadyAuth).toBe(true);
});

test("visiting an internal route with a blacklisted token fails as expected", async () => {
    causeRepo.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const profileViewRequest = {
        // no userId specified!!!
        authToken: "toBeReceived",
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logIn(userId);
    expect(jose.verifyAndGetUserId(authToken)).toStrictEqual(userId);
    profileViewRequest.authToken = authToken;

    const response = await request(app)
        .get("/causes")
        .send(profileViewRequest)
        .redirects(0);

    expect(causeRepo.findAll).toHaveBeenCalledTimes(1)
    expect(response.body.data).toMatchObject([{
        ...cause,
        id: 1,
    }]);

    await authAgent.logOut(authToken);

    const response2 = await request(app)
        .get("/causes")
        .send(profileViewRequest)
        .redirects(1);

    expect(response2.body.message).toBe("JWT blacklisted");
    expect(response2.statusCode).toBe(401);
});
