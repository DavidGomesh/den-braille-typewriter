import { List } from "immutable"
import { Alphabet as ABC, Cell } from "../../main/braille/Cell"
import { toText } from "../../main/braille/Converter"

describe("Portuguese Spelling", () => {
    test("correct", () => {
        expect(toText(List([
            ABC.H as Cell, ABC.E as Cell, ABC.L as Cell, ABC.L as Cell, ABC.O as Cell
        ]))).toEqual("hello")
    })
    
    test("Upper Case", () => {
        expect(toText(List([
            Cell.C46, ABC.H, ABC.E, ABC.L, ABC.L, ABC.O
        ]))).toEqual("Hello")

        expect(toText(List([
            ABC.H, ABC.E, ABC.L, Cell.C46, ABC.L, ABC.O 
        ]))).toEqual("helLo")
        
        expect(toText(List([
            ABC.H, ABC.E, ABC.L, ABC.L, ABC.O, Cell.C46
        ]))).toEqual("hello")
    })

    test("Full Upper Case", () => {
        expect(toText(List([
            Cell.C46, Cell.C46, ABC.H, ABC.E, ABC.L, ABC.L, ABC.O, Cell.C0, ABC.W, ABC.O, ABC.R, ABC.L, ABC.D
        ]))).toEqual("HELLO world")
        
        expect(toText(List([
            Cell.C46, Cell.C46, ABC.H, ABC.E, ABC.L, ABC.L, ABC.O, Cell.C0, Cell.C46, Cell.C46, ABC.W, ABC.O, ABC.R, ABC.L, ABC.D
        ]))).toEqual("HELLO WORLD")
        
        expect(toText(List([
            Cell.C46, Cell.C46, ABC.H, ABC.E, ABC.L, ABC.L, ABC.O, Cell.C0, Cell.C46, ABC.W, ABC.O, ABC.R, ABC.L, ABC.D
        ]))).toEqual("HELLO World")

        expect(toText(List([
            ABC.H, ABC.E, ABC.L, ABC.L, ABC.O, Cell.C0, ABC.W, ABC.O, ABC.R, ABC.L, ABC.D, Cell.C46, Cell.C46
        ]))).toEqual("hello world")
    })
})