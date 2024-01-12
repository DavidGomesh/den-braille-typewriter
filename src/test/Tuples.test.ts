import { Tuple2, tuple } from "../../fp/Tuples"

describe("tuple", () => {
    test("tuple must create a Tuple2", () => {
        expect(tuple(1, "One")).toEqual(new Tuple2(1, "One"))
    })
})