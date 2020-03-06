const validation = require("./index.js");
const testHelpers = require("../../test/testHelpers");

const event = testHelpers.event;
const address = testHelpers.address;

test("correct addresses accepted", () => {
    const correctAddress = {...address};
    expect(validation.validateAddress(correctAddress).errors.length).toBe(0);
});

test("incorrect addresses rejected", () => {
    const incorrectAddress = {...address};
    incorrectAddress.address_1 = 15;
    expect(validation.validateAddress(incorrectAddress).errors.length).toBe(1);
    incorrectAddress.lat = -1000;
    expect(validation.validateAddress(incorrectAddress).errors.length).toBe(2);
    delete incorrectAddress.city;
    expect(validation.validateAddress(incorrectAddress).errors.length).toBe(3);
});

test("correct events accepted", () => {
    const correctEvent = {...event};
    expect(validation.validateEvent(correctEvent).errors.length).toBe(0);
});

test("incorrect addresses rejected", () => {
    const incorrectEvent = {...event};
    incorrectEvent.name = 15;
    expect(validation.validateEvent(incorrectEvent).errors.length).toBe(1);
    incorrectEvent.physical = "what?";
    expect(validation.validateEvent(incorrectEvent).errors.length).toBe(2);
    delete incorrectEvent.women_only;
    expect(validation.validateEvent(incorrectEvent).errors.length).toBe(3);
});
