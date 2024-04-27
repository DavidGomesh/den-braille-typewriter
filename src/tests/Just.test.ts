import { Set } from "immutable"

describe("Test", () => {
    test("that", () => {
        expect(Set(["1", "2", "3"]).reduce((acc, x) => acc + x, "")).toEqual("123")
        console.log(Set(["1", "2", "3"]).reduce((acc, x) => acc + x, ""))
    })
})