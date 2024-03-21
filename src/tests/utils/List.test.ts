import { none, some } from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/function"
import { List } from "immutable"
import { htOption, span } from "../../utils/List.ts"
import { Tuple } from "../../utils/Tuples.ts"

const list123: List<number> = List([1, 2, 3])
const emptyList: List<number> = List()

describe("span", () => {
    test("span must divide elements of the list", () => {
        expect(pipe(list123, span(_ => _ == 1))).toEqual(Tuple(List([1]), List([2, 3])))
        expect(pipe(emptyList, span(_ => _ == 1))).toEqual(Tuple(emptyList, emptyList))
        expect(pipe(list123, span(_ => _ < 4))).toEqual(Tuple(list123, emptyList))
        expect(pipe(list123, span(_ => _ > 4))).toEqual(Tuple(emptyList, list123))
    })
})

describe("htOption", () => {
    test("Should return none for an empty List", () => {
        expect(pipe(emptyList, htOption)).toEqual(none)
    })

    test("Should return some Tuple for a non-empty List", () => {
        expect(pipe(list123, htOption)).toEqual(some(Tuple(1, List([2, 3]))))
    })
})