import { none, some } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { Map } from "immutable";
import { getOption } from "../../utils/Map.ts";

describe("getOption", () => {
    const map = Map([['A', 1], ['B', 1]])

    test('Should return some value if key exists in the map', () => {
        expect(pipe('A', getOption(map))).toEqual(some(1));
    });

    test('Should return none value if key does not exists in the map', () => {
        expect(pipe('C', getOption(map))).toEqual(none);
    });
})