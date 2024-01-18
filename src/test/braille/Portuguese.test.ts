import { A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z } from "../../main/braille/Alphabet.ts"
import { Portuguese } from "../../main/braille/converters/Portuguese.ts"
import { CAP } from "../../main/braille/Identifiers.ts"
import { List } from "immutable"
import { SPC } from "../../main/braille/Symbols.ts"

describe("Portuguese Spelling", () => {
    
    const converter = new Portuguese()

    test("Simple text", () => {
        expect(converter.convert(List([H,E,L,L,O]))).toEqual("hello")
        expect(converter.convert(List([A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z]))).toEqual("abcdefghijklmnopqrstuvwxyz")
    })

    test("Spaces", () => {
        expect(converter.convert(List([H,E,L,L,O,SPC,W,O,R,L,D]))).toEqual("hello world")
        expect(converter.convert(List([SPC,H,E,L,L,O,SPC]))).toEqual(" hello ")
        expect(converter.convert(List([SPC,SPC,SPC]))).toEqual("   ")
    })
    
    test("Upper case", () => {
        expect(converter.convert(List([CAP,H,E,L,L,O]))).toEqual("Hello")
        expect(converter.convert(List([H,E,L,CAP,L,O]))).toEqual("helLo")
        expect(converter.convert(List([H,E,L,L,O,CAP]))).toEqual("hello")
    })

    test("Full upper case", () => {
        expect(converter.convert(List([CAP,CAP,H,E,L,L,O,SPC,W,O,R,L,D]))).toEqual("HELLO world")
        expect(converter.convert(List([CAP,CAP,H,E,L,L,O,SPC,CAP,CAP,W,O,R,L,D]))).toEqual("HELLO WORLD")
        expect(converter.convert(List([CAP,CAP,H,E,L,L,O,SPC,CAP,W,O,R,L,D]))).toEqual("HELLO World")
        expect(converter.convert(List([H,E,L,L,O,SPC,W,O,R,L,D,CAP,CAP]))).toEqual("hello world")
    })
})