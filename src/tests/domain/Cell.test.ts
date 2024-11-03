import { List } from "immutable"
import { Cell, cellToString, findCell, stringToCellList } from "../../domain/Cell.ts"


describe("cellToString", () => {
    it("should return correct string for valid Cell enums", () => {
        expect(cellToString(Cell.C0)).toBe("_")
        expect(cellToString(Cell.C1)).toBe("a")
        expect(cellToString(Cell.C12345)).toBe("q")
        expect(cellToString(Cell.C56)).toBe("$")
    })
})

describe("findCell", () => {
    it("should return the correct Cell enum for each mapped character", () => {
        expect(findCell("a")).toEqual([Cell.C1, "a"])
        expect(findCell("b")).toEqual([Cell.C12, "b"])
        expect(findCell("q")).toEqual([Cell.C12345, "q"])
        expect(findCell("M")).toEqual([Cell.C46, "M"])
        expect(findCell("$")).toEqual([Cell.C56, "$"])
    })

    it("should return undefined for unmapped characters", () => {
        expect(findCell("\\")).toBeUndefined()
        expect(findCell("0")).toBeUndefined()
    })
})

describe("stringToCellList", () => {
    it("should convert a string with mapped characters to corresponding Cell enums", () => {
        expect(stringToCellList("abc")).toEqual(List([Cell.C1, Cell.C12, Cell.C14]))
        expect(stringToCellList("M$")).toEqual(List([Cell.C46, Cell.C56]))
        expect(stringToCellList("abç")).toEqual(List([Cell.C1, Cell.C12, Cell.C12346]))
    })

    it("should throw an error for characters not present in cellStringMap", () => {
        expect(() => stringToCellList("\\")).toThrow("Character not mapped: \\")
        expect(() => stringToCellList("1")).toThrow("Character not mapped: 1")
    })

    it("should handle empty strings correctly", () => {
        expect(stringToCellList("")).toEqual(List())
    })

    it("should ignore newline and carriage return characters in the input string", () => {
        expect(stringToCellList("a\nb\r")).toEqual(List([Cell.C1, Cell.C12]))
    })
})
