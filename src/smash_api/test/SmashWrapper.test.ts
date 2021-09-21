import SmashWrapper from "../SmashWrapper";
require('dotenv').config()

describe("singleton", () => {
    test("instances should be equal", () => {
        const instance_1 = SmashWrapper.instance;
        const instance_2 = SmashWrapper.instance;
        return expect(instance_1 === instance_2).toBe(true);
    });
});

describe("get_tournament()", () => {
    const smash = SmashWrapper.instance;
    test("should throw TypeError for get_tournament(null)", () => {
        return expect(smash.get_tournament(null)).rejects.toThrow(TypeError);
    });
    test("should throw TypeError for get_tournament(undefined)", () => {
        return expect(smash.get_tournament(null)).rejects.toThrow(TypeError);
    });
    test("should throw TypeError for get_tournament(boolean)", () => {
        return expect(smash.get_tournament(true)).rejects.toThrow(TypeError);
    });
    test("should resolve on get_tournament(valid_slug)", () => {
        return expect(smash.get_tournament("tournament/pyrateers-anti-meta-tournament")).resolves.toBeDefined();
    });
    test("should resolve on get_tournament(valid_id)", () => {
        return expect(smash.get_tournament(291344)).resolves.toBeDefined();
    });
    test("should get null on get_tournament(-1)", () => {
        return expect(smash.get_tournament(-1)).resolves.toBeNull();
    });
    test("should find Pyrateers tournament by slug", () => {
        return expect(smash.get_tournament("tournament/pyrateers-anti-meta-tournament")).resolves.toHaveProperty("id", 291344);
    });
});
