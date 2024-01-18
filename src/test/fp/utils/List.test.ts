import { pipe } from "fp-ts/lib/function"
import { List } from "immutable"
import { span } from "../../../main/fp/utils/List"
import { Tuple } from "../../../main/fp/Tuples"

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