import { Set } from "immutable"
import { canConvertKeysToCell, codeKeyMap, codeToKey, isActionKey, isArrowKey, isDotKey, isMappedKey, Key, keysToCell } from "../../domain/Key.ts"
import { Cell } from "../../domain/Cell.ts"

describe("codeKeyMap and related key functions", () => {
    test("correctly maps code strings to Key enum values", () => {
        expect(codeKeyMap.get('KeyF')).toBe(Key.DOT1)
        expect(codeKeyMap.get('KeyD')).toBe(Key.DOT2)
        expect(codeKeyMap.get('Backspace')).toBe(Key.BACKSPACE)
        expect(codeKeyMap.get('KeyQ')).toBe(Key.ENTER)
    })

    test("isMappedKey identifies mapped keys correctly", () => {
        expect(isMappedKey('KeyF')).toBe(true)
        expect(isMappedKey('KeyZ')).toBe(false)
    })

    test("codeToKey converts valid codes to keys and throws error for invalid codes", () => {
        expect(codeToKey('KeyF')).toBe(Key.DOT1)
        expect(() => codeToKey('InvalidKey')).toThrow("Can't to convert InvalidKey to a Key")
    })
})

describe("Key classification functions", () => {
    test("isActionKey identifies action keys correctly", () => {
        expect(isActionKey(Key.CONFIRM)).toBe(true)
        expect(isActionKey(Key.DOT1)).toBe(false)
    })

    test("isArrowKey identifies arrow keys correctly", () => {
        expect(isArrowKey(Key.ARROW_UP)).toBe(true)
        expect(isArrowKey(Key.DOT2)).toBe(false)
    })

    test("isDotKey identifies dot keys correctly", () => {
        expect(isDotKey(Key.DOT1)).toBe(true)
        expect(isDotKey(Key.ARROW_LEFT)).toBe(false)
    })
})

describe("keysToCell and keysCellMap functionality", () => {
    test("keysToCell correctly converts key sets to Cell enums", () => {
        expect(keysToCell(Set([Key.DOT1]))).toBe(Cell.C1)
        expect(keysToCell(Set([Key.DOT1, Key.DOT4, Key.DOT5]))).toBe(Cell.C145)
        expect(keysToCell(Set([Key.DOT2, Key.DOT3, Key.DOT6]))).toBe(Cell.C236)
    })

    test("canConvertKeysToCell correctly identifies if a set of keys can be converted to a Cell", () => {
        expect(canConvertKeysToCell(Set([Key.DOT1, Key.DOT4]))).toBe(true) // C14
        expect(canConvertKeysToCell(Set([Key.DOT1, Key.DOT3, Key.DOT5]))).toBe(true) // C135
    })

    test("keysToCell throws error for non-mapped key sets", () => {
        expect(() => keysToCell(Set([]))).toThrow()
    })
})

describe("Specific key mappings", () => {
    test("space and special characters are mapped correctly", () => {
        expect(keysToCell(Set([Key.SPACE]))).toBe(Cell.C0)
        expect(keysToCell(Set([Key.DOT5, Key.DOT6]))).toBe(Cell.C56)
        expect(keysToCell(Set([Key.DOT2, Key.DOT5, Key.DOT6]))).toBe(Cell.C256)
    })

    test("comprehensive check for dot key mappings", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT2]))).toBe(Cell.C12)
        expect(keysToCell(Set([Key.DOT1, Key.DOT2, Key.DOT5]))).toBe(Cell.C125)
        expect(keysToCell(Set([Key.DOT1, Key.DOT3, Key.DOT5, Key.DOT6]))).toBe(Cell.C1356)
    })
})
