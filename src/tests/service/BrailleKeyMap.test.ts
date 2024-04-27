import { none, some } from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/function"
import { Map, Set } from "immutable"
import { Cell } from "../../domain/Cell.ts"
import { Key } from "../../domain/Key.ts"
import { defaultKeyCodeMap, keysToCell, codeToKey } from "../../service/BrailleKeyMap.ts"

describe("codeToKey", () => {
    describe("using default defaultKeyCodeMap", () => {
        test("Should return none for invalid key codes", () => {
            expect(pipe('KeyA', codeToKey(defaultKeyCodeMap))).toEqual(none)
            expect(pipe('KeyG', codeToKey(defaultKeyCodeMap))).toEqual(none)
            expect(pipe('KeyH', codeToKey(defaultKeyCodeMap))).toEqual(none)
            expect(pipe('KeyH', codeToKey(defaultKeyCodeMap))).toEqual(none)
            expect(pipe('Semicolon', codeToKey(defaultKeyCodeMap))).toEqual(none)
        })

        // test("Should return Key.BACKSPACE for 8", () => {
        //     expect(pipe(8, codeToKey(defaultKeyCodeMap))).toEqual(some(Key.BACKSPACE))
        // })

        // test("Should return Key.ENTER for 81", () => {
        //     expect(pipe(81, codeToKey(defaultKeyCodeMap))).toEqual(some(Key.ENTER))
        // })

        // test("Should return Key.SPACE for 32", () => {
        //     expect(pipe(32, codeToKey(defaultKeyCodeMap))).toEqual(some(Key.SPACE))
        // })

        // test("Should return Key.DOT1 for 70", () => {
        //     expect(pipe(70, codeToKey(defaultKeyCodeMap))).toEqual(some(Key.DOT1))
        // })

        // test("Should return Key.DOT2 for 68", () => {
        //     expect(pipe(68, codeToKey(defaultKeyCodeMap))).toEqual(some(Key.DOT2))
        // })

        // test("Should return Key.DOT3 for 83", () => {
        //     expect(pipe(83, codeToKey(defaultKeyCodeMap))).toEqual(some(Key.DOT3))
        // })

        // test("Should return Key.DOT4 for 74", () => {
        //     expect(pipe(74, codeToKey(defaultKeyCodeMap))).toEqual(some(Key.DOT4))
        // })

        // test("Should return Key.DOT5 for 75", () => {
        //     expect(pipe(75, codeToKey(defaultKeyCodeMap))).toEqual(some(Key.DOT5))
        // })

        // test("Should return Key.DOT6 for 76", () => {
        //     expect(pipe(76, codeToKey(defaultKeyCodeMap))).toEqual(some(Key.DOT6))
        // })
    })

    describe("using custom defaultKeyCodeMap", () => {
        const customKeyCodeMap = Map([
            [7, Key.BACKSPACE],
            [8, Key.ENTER],
            [9, Key.SPACE],
            [1, Key.DOT1],
            [2, Key.DOT2],
            [3, Key.DOT3],
            [4, Key.DOT4],
            [5, Key.DOT5],
            [6, Key.DOT6],
        ])

        // test("Should return none for invalid key codes", () => {
        //     expect(pipe(10, codeToKey(customKeyCodeMap))).toEqual(none)
        //     expect(pipe(11, codeToKey(customKeyCodeMap))).toEqual(none)
        //     expect(pipe(12, codeToKey(customKeyCodeMap))).toEqual(none)
        // })

        // test("Should return Key.BACKSPACE for 8", () => {
        //     expect(pipe(7, codeToKey(customKeyCodeMap))).toEqual(some(Key.BACKSPACE))
        // })

        // test("Should return Key.ENTER for 81", () => {
        //     expect(pipe(8, codeToKey(customKeyCodeMap))).toEqual(some(Key.ENTER))
        // })

        // test("Should return Key.SPACE for 32", () => {
        //     expect(pipe(9, codeToKey(customKeyCodeMap))).toEqual(some(Key.SPACE))
        // })

        // test("Should return Key.DOT1 for 70", () => {
        //     expect(pipe(1, codeToKey(customKeyCodeMap))).toEqual(some(Key.DOT1))
        // })

        // test("Should return Key.DOT2 for 68", () => {
        //     expect(pipe(2, codeToKey(customKeyCodeMap))).toEqual(some(Key.DOT2))
        // })

        // test("Should return Key.DOT3 for 83", () => {
        //     expect(pipe(3, codeToKey(customKeyCodeMap))).toEqual(some(Key.DOT3))
        // })

        // test("Should return Key.DOT4 for 74", () => {
        //     expect(pipe(4, codeToKey(customKeyCodeMap))).toEqual(some(Key.DOT4))
        // })

        // test("Should return Key.DOT5 for 75", () => {
        //     expect(pipe(5, codeToKey(customKeyCodeMap))).toEqual(some(Key.DOT5))
        // })

        // test("Should return Key.DOT6 for 76", () => {
        //     expect(pipe(6, codeToKey(customKeyCodeMap))).toEqual(some(Key.DOT6))
        // })
    })
})

describe("keysToCell", () => {
    test("Should return Cell.C0", () => {
        expect(keysToCell(Set([Key.SPACE]))).toEqual(some(Cell.C0))
    })
    
    test("Should return Cell.C2346", () => {
        expect(keysToCell(Set([Key.DOT2, Key.DOT3, Key.DOT4, Key.DOT6]))).toEqual(some(Cell.C2346))
    })
    
    test("Should return Cell.C5", () => {
        expect(keysToCell(Set([Key.DOT5]))).toEqual(some(Cell.C5))
    })
    
    test("Should return Cell.C3456", () => {
        expect(keysToCell(Set([Key.DOT3, Key.DOT4, Key.DOT5, Key.DOT6]))).toEqual(some(Cell.C3456))
    })
    
    test("Should return Cell.C1246", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT2, Key.DOT4, Key.DOT6]))).toEqual(some(Cell.C1246))
    })
    
    test("Should return Cell.C146", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT4, Key.DOT6]))).toEqual(some(Cell.C146))
    })
    
    test("Should return Cell.C12346", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT2, Key.DOT3, Key.DOT4, Key.DOT6]))).toEqual(some(Cell.C12346))
    })
    
    test("Should return Cell.C3", () => {
        expect(keysToCell(Set([Key.DOT3]))).toEqual(some(Cell.C3))
    })
    
    test("Should return Cell.C12356", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT2, Key.DOT3, Key.DOT5, Key.DOT6]))).toEqual(some(Cell.C12356))
    })
    
    test("Should return Cell.C23456", () => {
        expect(keysToCell(Set([Key.DOT2, Key.DOT3, Key.DOT4, Key.DOT5, Key.DOT6]))).toEqual(some(Cell.C23456))
    })
    
    test("Should return Cell.C16", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT6]))).toEqual(some(Cell.C16))
    })
    
    test("Should return Cell.C346", () => {
        expect(keysToCell(Set([Key.DOT3, Key.DOT4, Key.DOT6]))).toEqual(some(Cell.C346))
    })
    
    test("Should return Cell.C6", () => {
        expect(keysToCell(Set([Key.DOT6]))).toEqual(some(Cell.C6))
    })
    
    test("Should return Cell.C36", () => {
        expect(keysToCell(Set([Key.DOT3, Key.DOT6]))).toEqual(some(Cell.C36))
    })
    
    test("Should return Cell.C46", () => {
        expect(keysToCell(Set([Key.DOT4, Key.DOT6]))).toEqual(some(Cell.C46))
    })
    
    test("Should return Cell.C34", () => {
        expect(keysToCell(Set([Key.DOT3, Key.DOT4]))).toEqual(some(Cell.C34))
    })
    
    test("Should return Cell.C356", () => {
        expect(keysToCell(Set([Key.DOT3, Key.DOT5, Key.DOT6]))).toEqual(some(Cell.C356))
    })
    
    test("Should return Cell.C2", () => {
        expect(keysToCell(Set([Key.DOT2]))).toEqual(some(Cell.C2))
    })
    
    test("Should return Cell.C23", () => {
        expect(keysToCell(Set([Key.DOT2, Key.DOT3]))).toEqual(some(Cell.C23))
    })
    
    test("Should return Cell.C25", () => {
        expect(keysToCell(Set([Key.DOT2, Key.DOT5]))).toEqual(some(Cell.C25))
    })
    
    test("Should return Cell.C256", () => {
        expect(keysToCell(Set([Key.DOT2, Key.DOT5, Key.DOT6]))).toEqual(some(Cell.C256))
    })
    
    test("Should return Cell.C26", () => {
        expect(keysToCell(Set([Key.DOT2, Key.DOT6]))).toEqual(some(Cell.C26))
    })
    
    test("Should return Cell.C235", () => {
        expect(keysToCell(Set([Key.DOT2, Key.DOT3, Key.DOT5]))).toEqual(some(Cell.C235))
    })
    
    test("Should return Cell.C2356", () => {
        expect(keysToCell(Set([Key.DOT2, Key.DOT3, Key.DOT5, Key.DOT6]))).toEqual(some(Cell.C2356))
    })
    
    test("Should return Cell.C236", () => {
        expect(keysToCell(Set([Key.DOT2, Key.DOT3, Key.DOT6]))).toEqual(some(Cell.C236))
    })
    
    test("Should return Cell.C35", () => {
        expect(keysToCell(Set([Key.DOT3, Key.DOT5]))).toEqual(some(Cell.C35))
    })
    
    test("Should return Cell.C156", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT5, Key.DOT6]))).toEqual(some(Cell.C156))
    })
    
    test("Should return Cell.C56", () => {
        expect(keysToCell(Set([Key.DOT5, Key.DOT6]))).toEqual(some(Cell.C56))
    })
    
    test("Should return Cell.C126", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT2, Key.DOT6]))).toEqual(some(Cell.C126))
    })
    
    test("Should return Cell.C123456", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT2, Key.DOT3, Key.DOT4, Key.DOT5, Key.DOT6]))).toEqual(some(Cell.C123456))
    })
    
    test("Should return Cell.C345", () => {
        expect(keysToCell(Set([Key.DOT3, Key.DOT4, Key.DOT5]))).toEqual(some(Cell.C345))
    })
    
    test("Should return Cell.C1456", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT4, Key.DOT5, Key.DOT6]))).toEqual(some(Cell.C1456))
    })
    
    test("Should return Cell.C4", () => {
        expect(keysToCell(Set([Key.DOT4]))).toEqual(some(Cell.C4))
    })
    
    test("Should return Cell.C1", () => {
        expect(keysToCell(Set([Key.DOT1]))).toEqual(some(Cell.C1))
    })
    
    test("Should return Cell.C12", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT2]))).toEqual(some(Cell.C12))
    })
    
    test("Should return Cell.C14", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT4]))).toEqual(some(Cell.C14))
    })
    
    test("Should return Cell.C145", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT4, Key.DOT5]))).toEqual(some(Cell.C145))
    })
    
    test("Should return Cell.C15", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT5]))).toEqual(some(Cell.C15))
    })
    
    test("Should return Cell.C124", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT2, Key.DOT4]))).toEqual(some(Cell.C124))
    })
    
    test("Should return Cell.C1245", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT2, Key.DOT4, Key.DOT5]))).toEqual(some(Cell.C1245))
    })
    
    test("Should return Cell.C125", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT2, Key.DOT5]))).toEqual(some(Cell.C125))
    })
    
    test("Should return Cell.C24", () => {
        expect(keysToCell(Set([Key.DOT2, Key.DOT4]))).toEqual(some(Cell.C24))
    })
    
    test("Should return Cell.C245", () => {
        expect(keysToCell(Set([Key.DOT2, Key.DOT4, Key.DOT5]))).toEqual(some(Cell.C245))
    })
    
    test("Should return Cell.C13", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT3]))).toEqual(some(Cell.C13))
    })
    
    test("Should return Cell.C123", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT2, Key.DOT3]))).toEqual(some(Cell.C123))
    })
    
    test("Should return Cell.C134", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT3, Key.DOT4]))).toEqual(some(Cell.C134))
    })
    
    test("Should return Cell.C1345", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT3, Key.DOT4, Key.DOT5]))).toEqual(some(Cell.C1345))
    })
    
    test("Should return Cell.C135", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT3, Key.DOT5]))).toEqual(some(Cell.C135))
    })
    
    test("Should return Cell.C1234", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT2, Key.DOT3, Key.DOT4]))).toEqual(some(Cell.C1234))
    })
    
    test("Should return Cell.C12345", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT2, Key.DOT3, Key.DOT4, Key.DOT5]))).toEqual(some(Cell.C12345))
    })
    
    test("Should return Cell.C1235", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT2, Key.DOT3, Key.DOT5]))).toEqual(some(Cell.C1235))
    })
    
    test("Should return Cell.C234", () => {
        expect(keysToCell(Set([Key.DOT2, Key.DOT3, Key.DOT4]))).toEqual(some(Cell.C234))
    })
    
    test("Should return Cell.C2345", () => {
        expect(keysToCell(Set([Key.DOT2, Key.DOT3, Key.DOT4, Key.DOT5]))).toEqual(some(Cell.C2345))
    })
    
    test("Should return Cell.C136", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT3, Key.DOT6]))).toEqual(some(Cell.C136))
    })
    
    test("Should return Cell.C1236", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT2, Key.DOT3, Key.DOT6]))).toEqual(some(Cell.C1236))
    })
    
    test("Should return Cell.C2456", () => {
        expect(keysToCell(Set([Key.DOT2, Key.DOT4, Key.DOT5, Key.DOT6]))).toEqual(some(Cell.C2456))
    })
    
    test("Should return Cell.C1346", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT3, Key.DOT4, Key.DOT6]))).toEqual(some(Cell.C1346))
    })
    
    test("Should return Cell.C13456", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT3, Key.DOT4, Key.DOT5, Key.DOT6]))).toEqual(some(Cell.C13456))
    })
    
    test("Should return Cell.C1356", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT3, Key.DOT5, Key.DOT6]))).toEqual(some(Cell.C1356))
    })
    
    test("Should return Cell.C246", () => {
        expect(keysToCell(Set([Key.DOT2, Key.DOT4, Key.DOT6]))).toEqual(some(Cell.C246))
    })
    
    test("Should return Cell.C1256", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT2, Key.DOT5, Key.DOT6]))).toEqual(some(Cell.C1256))
    })
    
    test("Should return Cell.C12456", () => {
        expect(keysToCell(Set([Key.DOT1, Key.DOT2, Key.DOT4, Key.DOT5, Key.DOT6]))).toEqual(some(Cell.C12456))
    })
    
    test("Should return Cell.C45", () => {
        expect(keysToCell(Set([Key.DOT4, Key.DOT5]))).toEqual(some(Cell.C45))
    })
    
    test("Should return Cell.C456", () => {
        expect(keysToCell(Set([Key.DOT4, Key.DOT5, Key.DOT6]))).toEqual(some(Cell.C456))
    })
})