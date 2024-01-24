import { Map } from "immutable"
import { pipe } from "fp-ts/lib/function"
import { Option } from "fp-ts/lib/Option"

import { Cell } from "./Cell.ts"
import { getOption } from "../utils/Map.ts"

export function keyToDot(key: number): Option<string> {
    return pipe(keyDotMap, getOption(key))
}

export function dotsToCell(dots: string): Option<Cell> {
    return pipe(brailleDotsMap, getOption(dots))
}

const keyDotMap: Map<number, string> = Map([
    [81, "e"], 
    [32, "0"], 

    [70, "1"], 
    [68, "2"], 
    [83, "3"], 
    [74, "4"], 
    [75, "5"], 
    [76, "6"],
])

const brailleDotsMap: Map<string, Cell> = Map([
    [`e`,      Cell.ENTER],
    [`0`,      Cell.C0],
    [`2346`,   Cell.C2346],
    [`5`,      Cell.C5],
    [`3456`,   Cell.C3456],
    [`1246`,   Cell.C1246],
    [`146`,    Cell.C146],
    [`12346`,  Cell.C12346],
    [`3`,      Cell.C3],
    [`12356`,  Cell.C12356],
    [`23456`,  Cell.C23456],
    [`16`,     Cell.C16],
    [`346`,    Cell.C346],
    [`6`,      Cell.C6],
    [`36`,     Cell.C36],
    [`46`,     Cell.C46],
    [`34`,     Cell.C34],
    [`356`,    Cell.C356],
    [`2`,      Cell.C2],
    [`23`,     Cell.C23],
    [`25`,     Cell.C25],
    [`256`,    Cell.C256],
    [`26`,     Cell.C26],
    [`235`,    Cell.C235],
    [`2356`,   Cell.C2356],
    [`236`,    Cell.C236],
    [`35`,     Cell.C35],
    [`156`,    Cell.C156],
    [`56`,     Cell.C56],
    [`126`,    Cell.C126],
    [`123456`, Cell.C123456],
    [`345`,    Cell.C345],
    [`1456`,   Cell.C1456],
    [`4`,      Cell.C4],
    [`1`,      Cell.C1],
    [`12`,     Cell.C12],
    [`14`,     Cell.C14],
    [`145`,    Cell.C145],
    [`15`,     Cell.C15],
    [`124`,    Cell.C124],
    [`1245`,   Cell.C1245],
    [`125`,    Cell.C125],
    [`24`,     Cell.C24],
    [`245`,    Cell.C245],
    [`13`,     Cell.C13],
    [`123`,    Cell.C123],
    [`134`,    Cell.C134],
    [`1345`,   Cell.C1345],
    [`135`,    Cell.C135],
    [`1234`,   Cell.C1234],
    [`12345`,  Cell.C12345],
    [`1235`,   Cell.C1235],
    [`234`,    Cell.C234],
    [`2345`,   Cell.C2345],
    [`136`,    Cell.C136],
    [`1236`,   Cell.C1236],
    [`2456`,   Cell.C2456],
    [`1346`,   Cell.C1346],
    [`13456`,  Cell.C13456],
    [`1356`,   Cell.C1356],
    [`246`,    Cell.C246],
    [`1256`,   Cell.C1256],
    [`12456`,  Cell.C12456],
    [`45`,     Cell.C45],
    [`456`,    Cell.C456],
])