import List from "../fp/List";

export enum Cell {
    C0,

    C1, C2, C3, C4, C5, C6,

    C12, C13, C14, C15, C16,
    C23, C24, C25, C26,
    C34, C35, C36,
    C45, C46,
    C56,

    C123, C124, C125, C126, C134, C135, C136, C145, C146, C156,
    C234, C235, C236, C245, C246, C256,
    C345, C346, C356,
    C456,

    C1234, C1235, C1236, C1245, C1246, C1256, C1345, C1346, C1356, C1456,
    C2345, C2346, C2356, C2456,
    C3456,

    C12345, C12346, C12356, C12456, C13456,
    C23456,

    C123456,
}

export class Alphabet {
    static A: Cell = Cell.C1;     static B: Cell = Cell.C12;    static C: Cell = Cell.C14; 
    static D: Cell = Cell.C145;   static E: Cell = Cell.C15;    static F: Cell = Cell.C124; 
    static G: Cell = Cell.C1245;  static H: Cell = Cell.C125;   static I: Cell = Cell.C25; 
    static J: Cell = Cell.C245;   static K: Cell = Cell.C13;    static L: Cell = Cell.C123; 
    static M: Cell = Cell.C134;   static N: Cell = Cell.C1345;  static O: Cell = Cell.C135; 
    static P: Cell = Cell.C1234;  static Q: Cell = Cell.C12345; static R: Cell = Cell.C1235; 
    static S: Cell = Cell.C234;   static T: Cell = Cell.C2345;  static U: Cell = Cell.C136; 
    static V: Cell = Cell.C1236;  static W: Cell = Cell.C2456;  static X: Cell = Cell.C1346; 
    static Y: Cell = Cell.C13456; static Z: Cell = Cell.C1356;

    static isAlphabet(cell: Cell): boolean {
        return List.of([
            Alphabet.A, Alphabet.B, Alphabet.C, Alphabet.D, Alphabet.E,
            Alphabet.F, Alphabet.G, Alphabet.H, Alphabet.I, Alphabet.J,
            Alphabet.K, Alphabet.L, Alphabet.M, Alphabet.N, Alphabet.O,
            Alphabet.P, Alphabet.Q, Alphabet.R, Alphabet.S, Alphabet.T,
            Alphabet.U, Alphabet.V, Alphabet.W, Alphabet.X, Alphabet.Y, 
            Alphabet.Z
        ]).contains(cell)
        
    }
}

export function isEmpty(cell: Cell): boolean {
    return cell === Cell.C0
}

export function isNotEmpty(cell: Cell): boolean {
    return !isEmpty(cell)
}

export function isCapital(cell: Cell): boolean {
    return cell === Cell.C46
}