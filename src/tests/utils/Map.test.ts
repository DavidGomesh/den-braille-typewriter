import { pipe } from "fp-ts/lib/function";
import { Map } from "immutable";
import { getOption } from "../../utils/Map";
import { none, some } from "fp-ts/lib/Option";

describe("getOption", () => {
    const map = Map([['A', 1], ['B', 1]])

    test('Should return some value if key exists in the map', () => {
        expect(pipe(map, getOption('A'))).toEqual(some(1));
    });

    test('Should return none value if key does not exists in the map', () => {
        expect(pipe(map, getOption('C'))).toEqual(none);
    });
})