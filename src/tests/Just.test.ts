import { Set } from "immutable"

describe("Just", () => {
    test("that", () => {
        expect(Set([1, 2, 3])).toEqual(Set([3, 2, 1]))
    })
})