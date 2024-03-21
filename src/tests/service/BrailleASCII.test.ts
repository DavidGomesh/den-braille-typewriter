import { some } from "fp-ts/lib/Option"
import { Cell } from "../../domain/Cell.ts"
import { cellToString } from "../../service/BrailleASCII.ts"

describe("cellToString", () => {
    test("Should return ' ' for Cell.C0", () => {
        expect(cellToString(Cell.C0)).toEqual(some(` `))
    })

    test("Should return '!' for Cell.C2346", () => {
        expect(cellToString(Cell.C2346)).toEqual(some(`!`))
    })

    test("Should return '\"' for Cell.C5", () => {
        expect(cellToString(Cell.C5)).toEqual(some(`"`))
    })

    test("Should return '#' for Cell.C3456", () => {
        expect(cellToString(Cell.C3456)).toEqual(some(`#`))
    })

    test("Should return '$' for Cell.C1246", () => {
        expect(cellToString(Cell.C1246)).toEqual(some(`$`))
    })

    test("Should return '%' for Cell.C146", () => {
        expect(cellToString(Cell.C146)).toEqual(some(`%`))
    })

    test("Should return '&' for Cell.C12346", () => {
        expect(cellToString(Cell.C12346)).toEqual(some(`&`))
    })

    test("Should return ''' for Cell.C3", () => {
        expect(cellToString(Cell.C3)).toEqual(some(`'`))
    })

    test("Should return '(' for Cell.C12356", () => {
        expect(cellToString(Cell.C12356)).toEqual(some(`(`))
    })

    test("Should return ')' for Cell.C23456", () => {
        expect(cellToString(Cell.C23456)).toEqual(some(`)`))
    })

    test("Should return '*' for Cell.C16", () => {
        expect(cellToString(Cell.C16)).toEqual(some(`*`))
    })

    test("Should return '+' for Cell.C346", () => {
        expect(cellToString(Cell.C346)).toEqual(some(`+`))
    })

    test("Should return ',' for Cell.C6", () => {
        expect(cellToString(Cell.C6)).toEqual(some(`,`))
    })

    test("Should return '-' for Cell.C36", () => {
        expect(cellToString(Cell.C36)).toEqual(some(`-`))
    })

    test("Should return '.' for Cell.C46", () => {
        expect(cellToString(Cell.C46)).toEqual(some(`.`))
    })

    test("Should return '/' for Cell.C34", () => {
        expect(cellToString(Cell.C34)).toEqual(some(`/`))
    })

    test("Should return '0' for Cell.C356", () => {
        expect(cellToString(Cell.C356)).toEqual(some(`0`))
    })

    test("Should return '1' for Cell.C2", () => {
        expect(cellToString(Cell.C2)).toEqual(some(`1`))
    })

    test("Should return '2' for Cell.C23", () => {
        expect(cellToString(Cell.C23)).toEqual(some(`2`))
    })

    test("Should return '3' for Cell.C25", () => {
        expect(cellToString(Cell.C25)).toEqual(some(`3`))
    })

    test("Should return '4' for Cell.C256", () => {
        expect(cellToString(Cell.C256)).toEqual(some(`4`))
    })

    test("Should return '5' for Cell.C26", () => {
        expect(cellToString(Cell.C26)).toEqual(some(`5`))
    })

    test("Should return '6' for Cell.C235", () => {
        expect(cellToString(Cell.C235)).toEqual(some(`6`))
    })

    test("Should return '7' for Cell.C2356", () => {
        expect(cellToString(Cell.C2356)).toEqual(some(`7`))
    })

    test("Should return '8' for Cell.C236", () => {
        expect(cellToString(Cell.C236)).toEqual(some(`8`))
    })

    test("Should return '9' for Cell.C35", () => {
        expect(cellToString(Cell.C35)).toEqual(some(`9`))
    })

    test("Should return ':' for Cell.C156", () => {
        expect(cellToString(Cell.C156)).toEqual(some(`:`))
    })

    test("Should return ';' for Cell.C56", () => {
        expect(cellToString(Cell.C56)).toEqual(some(`;`))
    })

    test("Should return '<' for Cell.C126", () => {
        expect(cellToString(Cell.C126)).toEqual(some(`<`))
    })

    test("Should return '=' for Cell.C123456", () => {
        expect(cellToString(Cell.C123456)).toEqual(some(`=`))
    })

    test("Should return '>' for Cell.C345", () => {
        expect(cellToString(Cell.C345)).toEqual(some(`>`))
    })

    test("Should return '?' for Cell.C1456", () => {
        expect(cellToString(Cell.C1456)).toEqual(some(`?`))
    })

    test("Should return '@' for Cell.C4", () => {
        expect(cellToString(Cell.C4)).toEqual(some(`@`))
    })

    test("Should return 'A' for Cell.C1", () => {
        expect(cellToString(Cell.C1)).toEqual(some(`A`))
    })

    test("Should return 'B' for Cell.C12", () => {
        expect(cellToString(Cell.C12)).toEqual(some(`B`))
    })

    test("Should return 'C' for Cell.C14", () => {
        expect(cellToString(Cell.C14)).toEqual(some(`C`))
    })

    test("Should return 'D' for Cell.C145", () => {
        expect(cellToString(Cell.C145)).toEqual(some(`D`))
    })

    test("Should return 'E' for Cell.C15", () => {
        expect(cellToString(Cell.C15)).toEqual(some(`E`))
    })

    test("Should return 'F' for Cell.C124", () => {
        expect(cellToString(Cell.C124)).toEqual(some(`F`))
    })

    test("Should return 'G' for Cell.C1245", () => {
        expect(cellToString(Cell.C1245)).toEqual(some(`G`))
    })

    test("Should return 'H' for Cell.C125", () => {
        expect(cellToString(Cell.C125)).toEqual(some(`H`))
    })

    test("Should return 'I' for Cell.C24", () => {
        expect(cellToString(Cell.C24)).toEqual(some(`I`))
    })

    test("Should return 'J' for Cell.C245", () => {
        expect(cellToString(Cell.C245)).toEqual(some(`J`))
    })

    test("Should return 'K' for Cell.C13", () => {
        expect(cellToString(Cell.C13)).toEqual(some(`K`))
    })

    test("Should return 'L' for Cell.C123", () => {
        expect(cellToString(Cell.C123)).toEqual(some(`L`))
    })

    test("Should return 'M' for Cell.C134", () => {
        expect(cellToString(Cell.C134)).toEqual(some(`M`))
    })

    test("Should return 'N' for Cell.C1345", () => {
        expect(cellToString(Cell.C1345)).toEqual(some(`N`))
    })

    test("Should return 'O' for Cell.C135", () => {
        expect(cellToString(Cell.C135)).toEqual(some(`O`))
    })

    test("Should return 'P' for Cell.C1234", () => {
        expect(cellToString(Cell.C1234)).toEqual(some(`P`))
    })

    test("Should return 'Q' for Cell.C12345", () => {
        expect(cellToString(Cell.C12345)).toEqual(some(`Q`))
    })

    test("Should return 'R' for Cell.C1235", () => {
        expect(cellToString(Cell.C1235)).toEqual(some(`R`))
    })

    test("Should return 'S' for Cell.C234", () => {
        expect(cellToString(Cell.C234)).toEqual(some(`S`))
    })

    test("Should return 'T' for Cell.C2345", () => {
        expect(cellToString(Cell.C2345)).toEqual(some(`T`))
    })

    test("Should return 'U' for Cell.C136", () => {
        expect(cellToString(Cell.C136)).toEqual(some(`U`))
    })

    test("Should return 'V' for Cell.C1236", () => {
        expect(cellToString(Cell.C1236)).toEqual(some(`V`))
    })

    test("Should return 'W' for Cell.C2456", () => {
        expect(cellToString(Cell.C2456)).toEqual(some(`W`))
    })

    test("Should return 'X' for Cell.C1346", () => {
        expect(cellToString(Cell.C1346)).toEqual(some(`X`))
    })

    test("Should return 'Y' for Cell.C13456", () => {
        expect(cellToString(Cell.C13456)).toEqual(some(`Y`))
    })

    test("Should return 'Z' for Cell.C1356", () => {
        expect(cellToString(Cell.C1356)).toEqual(some(`Z`))
    })

    test("Should return '[' for Cell.C246", () => {
        expect(cellToString(Cell.C246)).toEqual(some(`[`))
    })

    test("Should return '\\' for Cell.C1256", () => {
        expect(cellToString(Cell.C1256)).toEqual(some(`\\`))
    })

    test("Should return ']' for Cell.C12456", () => {
        expect(cellToString(Cell.C12456)).toEqual(some(`]`))
    })

    test("Should return '^' for Cell.C45", () => {
        expect(cellToString(Cell.C45)).toEqual(some(`^`))
    })

    test("Should return '_' for Cell.C456", () => {
        expect(cellToString(Cell.C456)).toEqual(some(`_`))
    })
})