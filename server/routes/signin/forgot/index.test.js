const request = require('supertest');
const app = require('../../../app');
const testHelpers = require("../../../test/helpers");
const jose = require("../../../modules/jose");
const userRepository = require("../../../repositories/user");
const resetRepository = require("../../../repositories/reset");
const mailSender = require("../../../modules/mail");
const authService = require("../../../modules/authentication");
const util = require("../../../util");

jest.mock("../../../repositories/reset");
jest.mock("../../../repositories/user");
jest.mock("../../../modules/mail");

let user; let reset1; let reset2;

beforeEach(() => {
    process.env.NO_AUTH = 1;
    user = testHelpers.getUserExample1();
    reset1 = testHelpers.getResetExample1();
    reset2 = testHelpers.getResetExample2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test('requesting reset password token works', async () => {
    resetRepository.insertResetToken.mockResolvedValue({
        rows: [{
            ...reset1,
            id: 1,
        }],
    });
    userRepository.findByEmail.mockResolvedValue({
        rows: [{
            ...user,
            id: 1,
        }],
    });
    mailSender.sendEmail.mockResolvedValue();
    const response = await request(app)
        .post("/signin/forgot")
        .send({
            data: {
                email: "test@gmail.com",
            },
        });

    expect(resetRepository.insertResetToken).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatch("Code sent successfully to test@gmail.com");
});

test('requesting reset password token with no email does not work', async () => {
    const response = await request(app)
        .post("/signin/forgot")
        .send({
            data: {

            },
        });

    expect(resetRepository.insertResetToken).toHaveBeenCalledTimes(0);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(0);
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch("No email was specified");
});

test('confirming correct token works', async () => {
    const dateTime = new Date();
    dateTime.setTime(dateTime.getTime() + (1 * 60 * 60 * 1000));
    userRepository.findByEmail.mockResolvedValue({
        rows: [{
            ...user,
            id: 1,
        }],
    });
    resetRepository.findLatestByUserId.mockResolvedValue({
        rows: [{
            ...reset2,
            id: 2,
            expiryDate: dateTime,
        },
        {
            ...reset1,
            id: 1,
            expiryDate: new Date(),
        },
        ],
    });
    const response = await request(app)
        .post("/signin/forgot/confirm")
        .send({
            data: {
                email: "test@gmail.com",
                token: "234567",
            },
            pub: jose.getEncPubAsPEM(),
        });
    expect(resetRepository.findLatestByUserId).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toMatch("Token accepted");
});

test('confirming correct token but not latest does not work', async () => {
    const dateTime = new Date();
    dateTime.setTime(dateTime.getTime() + (1 * 60 * 60 * 1000));
    userRepository.findByEmail.mockResolvedValue({
        rows: [{
            ...user,
            id: 1,
        }],
    });
    resetRepository.findLatestByUserId.mockResolvedValue({
        rows: [{
            ...reset2,
            id: 2,
            expiryDate: dateTime,
        },
        {
            ...reset1,
            id: 1,
            expiryDate: new Date(),
        },
        ],
    });
    const response = await request(app)
        .post("/signin/forgot/confirm")
        .send({
            data: {
                email: "test@gmail.com",
                token: "123456",
            },
        });
    expect(resetRepository.findLatestByUserId).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch("Tokens did not match");
});

test('confirming incorrect token returns incorrect token response', async () => {
    const dateTime = new Date();
    dateTime.setTime(dateTime.getTime() + (1 * 60 * 60 * 1000));
    userRepository.findByEmail.mockResolvedValue({
        rows: [{
            ...user,
            id: 1,
        }],
    });
    resetRepository.findLatestByUserId.mockResolvedValue({
        rows: [{
            ...reset1,
            id: 1,
            expiryDate: dateTime,
        }],
    });
    const response = await request(app)
        .post("/signin/forgot/confirm")
        .send({
            data: {
                email: "test@gmail.com",
                token: "incorrect token",
            },
        });
    expect(resetRepository.findLatestByUserId).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch("Tokens did not match");
});

test('confirming expired token returns token expired response', async () => {
    const dateTime = util.getCurrentTimeInUtcAsString(-30);
    userRepository.findByEmail.mockResolvedValue({
        rows: [{
            ...user,
            id: 1,
        }],
    });
    resetRepository.findLatestByUserId.mockResolvedValue({
        rows: [{
            ...reset1,
            id: 1,
            expiryDate: dateTime,
        }],
    });
    const response = await request(app)
        .post("/signin/forgot/confirm")
        .send({
            data: {
                email: "test@gmail.com",
                token: "123456",
            },
        });
    expect(resetRepository.findLatestByUserId).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch("Token expired");
});

test('confirming with no token specified returns token not defined response', async () => {
    const dateTime = new Date();
    dateTime.setTime(dateTime.getTime() - (1 * 60 * 60 * 1000));
    userRepository.findByEmail.mockResolvedValue({
        rows: [{
            ...user,
            id: 1,
        }],
    });
    const response = await request(app)
        .post("/signin/forgot/confirm")
        .send({
            data: {
                email: "test@gmail.com",
            },
        });
    expect(resetRepository.findLatestByUserId).toHaveBeenCalledTimes(0);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch("Token not defined");
});

test('confirming token not sent to email returns no token sent response', async () => {
    userRepository.findByEmail.mockResolvedValue({
        rows: [{
            ...user,
            id: 1,
        }],
    });
    resetRepository.findLatestByUserId.mockResolvedValue({
        rows: [],
    });
    const response = await request(app)
        .post("/signin/forgot/confirm")
        .send({
            data: {
                email: "test@gmail.com",
                token: "123456",
            },
        });
    expect(resetRepository.findLatestByUserId).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(404);
    expect(response.text).toMatch("No token sent to test@gmail.com");
});

test('requesting reset password token when a server error occurs returns error message as expected', async () => {
    resetRepository.insertResetToken.mockResolvedValue({
        rows: [{
            ...reset1,
            id: 1,
        }],
    });
    userRepository.findByEmail.mockResolvedValue({
        rows: [{
            ...user,
            id: 1,
        }],
    });
    mailSender.sendEmail.mockImplementation(() => {
        throw new Error("Server error");
    });
    const response = await request(app)
        .post("/signin/forgot")
        .send({
            data: {
                email: "test@gmail.com",
            },
        });

    expect(resetRepository.insertResetToken).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(500);
});

test('confirming correct token with invalid email fails as expected', async () => {
    const dateTime = new Date();
    dateTime.setTime(dateTime.getTime() + (1 * 60 * 60 * 1000));
    userRepository.findByEmail.mockResolvedValue({
        rows: [],
    });
    resetRepository.findLatestByUserId.mockResolvedValue({
        rows: [{
            ...reset2,
            id: 2,
            expiryDate: dateTime,
        },
        {
            ...reset1,
            id: 1,
            expiryDate: new Date(),
        },
        ],
    });
    const response = await request(app)
        .post("/signin/forgot/confirm")
        .send({
            data: {
                email: "invalidEmail",
                token: "234567",
            },
            pub: jose.getEncPubAsPEM(),
        });
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(resetRepository.findLatestByUserId).toHaveBeenCalledTimes(0);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toMatch("No user with specified email");
});

test('confirming correct token with a system error returns error message as expected', async () => {
    const dateTime = new Date();
    dateTime.setTime(dateTime.getTime() + (1 * 60 * 60 * 1000));
    userRepository.findByEmail.mockResolvedValue({
        rows: [{
            ...user,
            id: 1,
        }],
    });
    resetRepository.findLatestByUserId.mockResolvedValue({});
    const response = await request(app)
        .post("/signin/forgot/confirm")
        .send({
            data: {
                email: "test@gmail.com",
                token: "234567",
            },
            pub: jose.getEncPubAsPEM(),
        });
    expect(resetRepository.findLatestByUserId).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(500);
});
