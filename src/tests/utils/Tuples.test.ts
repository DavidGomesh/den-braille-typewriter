import { pipe } from "fp-ts/lib/function"
import { Tuple, fold } from "../../utils/Tuples"

describe("Tuple", () => {
    test("Tuple must create a new Tuple", () => {
        const tuple = Tuple(1, "one")
        expect(tuple.first).toEqual(1)
        expect(tuple.second).toEqual("one")
    })
})

describe("fold", () => {
    test("fold must transform the Tuple", () => {
        const tuple = Tuple(1, 2)
        expect(pipe(tuple, fold((a, b) => a + b))).toEqual(3)
        expect(pipe(tuple, fold((a, b) => Tuple(a + b, a * b)))).toEqual(Tuple(3, 2))
    })
})