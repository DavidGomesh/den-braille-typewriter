import { List } from "immutable"
import { A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z } from "../../main/braille/Alphabet.ts"
import { toText } from "../../main/braille/converters/Converter.ts"
import { CAP } from "../../main/braille/Identifiers.ts"
import { SPC } from "../../main/braille/Symbols.ts"

describe("Portuguese Spelling", () => {
    test("correct", () => {
        expect(toText(List([H,E,L,L,O]))).toEqual("hello")
    })
    
    test("Upper Case", () => {
        expect(toText(List([CAP,H,E,L,L,O]))).toEqual("Hello")
        expect(toText(List([H,E,L,CAP,L,O]))).toEqual("helLo")
        expect(toText(List([H,E,L,L,O,CAP]))).toEqual("hello")
    })

    test("Full Upper Case", () => {
        expect(toText(List([CAP,CAP,H,E,L,L,O,SPC,W,O,R,L,D]))).toEqual("HELLO world")
        expect(toText(List([CAP,CAP,H,E,L,L,O,SPC,CAP,CAP,W,O,R,L,D]))).toEqual("HELLO WORLD")
        expect(toText(List([CAP,CAP,H,E,L,L,O,SPC,CAP,W,O,R,L,D]))).toEqual("HELLO World")
        expect(toText(List([H,E,L,L,O,SPC,W,O,R,L,D,CAP,CAP]))).toEqual("hello world")
    })
})