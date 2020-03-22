const request = require("supertest");
const app = require("../../app");
const testHelpers = require("../../test/testHelpers");
const validation = require("../../modules/validation");
const informationService = require("../../modules/informationService");

jest.mock("../../modules/informationService");
jest.mock("../../modules/validation");
validation.validateInformation.mockReturnValue({errors: ""});

let information;

beforeEach(() => {
    jest.clearAllMocks();
    process.env.NO_AUTH = 1;
    information = testHelpers.getInformation();
});

afterEach(() => {
    jest.clearAllMocks();
});

test("information fetching endpoint works", async () => {
    informationService.getInformationData.mockResolvedValue({
        status: 200,
        message: "Information entry fetched successfully",
        data: {
            information: information
        },
    });

    const type = "privacyPolicy";
    const response = await request(app)
        .get(`/information?type=${type}`)
        .send();

    expect(informationService.getInformationData).toHaveBeenCalledTimes(1);
    expect(informationService.getInformationData).toHaveBeenCalledWith(type);
    expect(response.body.data).toMatchObject({
        information: information
    });
    expect(response.statusCode).toBe(200);
});
