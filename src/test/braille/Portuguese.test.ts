import { A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z } from "../../main/braille/Alphabet.ts"
import { Á, À, Â, Ã, É, Ê, Í, Ó, Ô, Õ, Ú, Ç } from "../../main/braille/Diacritics";
import { Portuguese } from "../../main/braille/converters/Portuguese.ts"
import { CAP } from "../../main/braille/Identifiers.ts"
import { List } from "immutable"
import { SPC } from "../../main/braille/Symbols.ts"

const c = new Portuguese()

describe("Alphabet", () => {
    test("A", () => expect(c.convert(List([A]))).toEqual("a"))
    test("B", () => expect(c.convert(List([B]))).toEqual("b"))
    test("C", () => expect(c.convert(List([C]))).toEqual("c"))
    test("D", () => expect(c.convert(List([D]))).toEqual("d"))
    test("E", () => expect(c.convert(List([E]))).toEqual("e"))
    test("F", () => expect(c.convert(List([F]))).toEqual("f"))
    test("G", () => expect(c.convert(List([G]))).toEqual("g"))
    test("H", () => expect(c.convert(List([H]))).toEqual("h"))
    test("I", () => expect(c.convert(List([I]))).toEqual("i"))
    test("J", () => expect(c.convert(List([J]))).toEqual("j"))
    test("K", () => expect(c.convert(List([K]))).toEqual("k"))
    test("L", () => expect(c.convert(List([L]))).toEqual("l"))
    test("M", () => expect(c.convert(List([M]))).toEqual("m"))
    test("N", () => expect(c.convert(List([N]))).toEqual("n"))
    test("O", () => expect(c.convert(List([O]))).toEqual("o"))
    test("P", () => expect(c.convert(List([P]))).toEqual("p"))
    test("Q", () => expect(c.convert(List([Q]))).toEqual("q"))
    test("R", () => expect(c.convert(List([R]))).toEqual("r"))
    test("S", () => expect(c.convert(List([S]))).toEqual("s"))
    test("T", () => expect(c.convert(List([T]))).toEqual("t"))
    test("U", () => expect(c.convert(List([U]))).toEqual("u"))
    test("V", () => expect(c.convert(List([V]))).toEqual("v"))
    test("W", () => expect(c.convert(List([W]))).toEqual("w"))
    test("X", () => expect(c.convert(List([X]))).toEqual("x"))
    test("Y", () => expect(c.convert(List([Y]))).toEqual("y"))
    test("Z", () => expect(c.convert(List([Z]))).toEqual("z"))

    test("Simple text", () => {
        expect(c.convert(List([H,E,L,L,O]))).toEqual("hello")
        expect(c.convert(List([A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z]))).toEqual("abcdefghijklmnopqrstuvwxyz")
    })
})

describe("Letters with diacritics", () => {
    test("Á", () => expect(c.convert(List([Á]))).toEqual("á"))
    test("À", () => expect(c.convert(List([À]))).toEqual("à"))
    test("Â", () => expect(c.convert(List([Â]))).toEqual("â"))
    test("Ã", () => expect(c.convert(List([Ã]))).toEqual("ã"))
    test("É", () => expect(c.convert(List([É]))).toEqual("é"))
    test("Ê", () => expect(c.convert(List([Ê]))).toEqual("ê"))
    test("Í", () => expect(c.convert(List([Í]))).toEqual("í"))
    test("Ó", () => expect(c.convert(List([Ó]))).toEqual("ó"))
    test("Ô", () => expect(c.convert(List([Ô]))).toEqual("ô"))
    test("Õ", () => expect(c.convert(List([Õ]))).toEqual("õ"))
    test("Ú", () => expect(c.convert(List([Ú]))).toEqual("ú"))
    test("Ç", () => expect(c.convert(List([Ç]))).toEqual("ç"))

    test("Simple tests", () => {
        expect(c.convert(List([Á,À,Â,Ã,É,Ê,Í,Ó,Ô,Õ,Ú,Ç]))).toEqual("áàâãéêíóôõúç")
        expect(c.convert(List([Á,R,V,O,R,E,SPC,Ô,N,I,B,U,S,SPC,Í,M,Ã]))).toEqual("árvore ônibus ímã")
    })
})


describe("Portuguese Spelling", () => {
    test("Spaces", () => {
        expect(c.convert(List([H,E,L,L,O,SPC,W,O,R,L,D]))).toEqual("hello world")
        expect(c.convert(List([SPC,H,E,L,L,O,SPC]))).toEqual(" hello ")
        expect(c.convert(List([SPC,SPC,SPC]))).toEqual("   ")
    })
    
    test("Upper case", () => {
        expect(c.convert(List([CAP,H,E,L,L,O]))).toEqual("Hello")
        expect(c.convert(List([H,E,L,CAP,L,O]))).toEqual("helLo")
        expect(c.convert(List([H,E,L,L,O,CAP]))).toEqual("hello")
    })

    test("Full upper case", () => {
        expect(c.convert(List([CAP,CAP,H,E,L,L,O,SPC,W,O,R,L,D]))).toEqual("HELLO world")
        expect(c.convert(List([CAP,CAP,H,E,L,L,O,SPC,CAP,CAP,W,O,R,L,D]))).toEqual("HELLO WORLD")
        expect(c.convert(List([CAP,CAP,H,E,L,L,O,SPC,CAP,W,O,R,L,D]))).toEqual("HELLO World")
        expect(c.convert(List([H,E,L,L,O,SPC,W,O,R,L,D,CAP,CAP]))).toEqual("hello world")
    })

    test("Letters with diacritics", () => {
        expect(c.convert(List([Á,À,Â,Ã,É,Ê,Í,Ó,Ô,Õ,Ú,Ç]))).toEqual("áàâãéêíóôõúç")
        expect(c.convert(List([Á,R,V,O,R,E,SPC,Ô,N,I,B,U,S,SPC,Í,M,Ã]))).toEqual("árvore ônibus ímã")
    })
})