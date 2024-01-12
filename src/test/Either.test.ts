import Either, { Left, Right } from "../../fp/Either"
import { None, Some } from "../../fp/Option"

const left:  Either<string, number> = new Left("Error")
const right: Either<string, number> = new Right(1)

describe("fold", () => {
    test("fold result must be true", () => {
        expect(right.fold(_ => false, _ => true)).toBeTruthy()
    })
    test("fold result must be false", () => {
        expect(left.fold(_ => false, _ => true)).toBeFalsy()
    })
})

describe("isLeft", () => {
    test("isLeft must return true", () => {
        expect(left.isLeft()).toBeTruthy()
    })
    test("isLeft must return false", () => {
        expect(right.isLeft()).toBeFalsy()
    })
})

describe("isRight", () => {
    test("isRight must return true", () => {
        expect(right.isRight()).toBeTruthy()
    })
    test("isRight must return false", () => {
        expect(left.isRight()).toBeFalsy()
    })
})

describe("getOrElse", () => {
    test("getOrElse must return the original value", () => {
        expect(right.getOrElse(99)).toEqual(1)
    })
    test("getOrElse must return the alternative value", () => {
        expect(left.getOrElse(99)).toEqual(99)
    })
})

describe("orElse", () => {
    test("orElse must return the original Either", () => {
        expect(right.orElse(() => new Right(99))).toEqual(right)
    })
    test("orElse must return the alternative Either", () => {
        expect(left.orElse(() => new Right(99))).toEqual(new Right(99))
    })
})

describe("contains", () => {
    test("contains must return true", () => {
        expect(right.contains(1)).toBeTruthy()
    })
    test("contains must return false", () => {
        expect(right.contains(99)).toBeFalsy()
        expect(left.contains(1)).toBeFalsy()
    })
})

describe("exists", () => {
    test("exists must return true", () => {
        expect(right.exists(_ => _ == 1)).toBeTruthy()
    })
    test("exists must return false", () => {
        expect(right.exists(_ => _ == 99)).toBeFalsy()
        expect(left.exists(_ => _ == 1)).toBeFalsy()
    })
})

describe("filterOrElse", () => {
    test("filterOrElse must return the original Either", () => {
        expect(right.filterOrElse(_ => _ == 1, () => "Error")).toEqual(right)
    })
    test("filterOrElse must return the given Left", () => {
        expect(right.filterOrElse(_ => _ == 99, () => "Error")).toEqual(left)
        expect(left.filterOrElse(_ => _ == 1, () => "Error 2")).toEqual(left)
    })
})

describe("map", () => {
    test("map shall transform the Option content", () => {
        expect(right.map(_ => _ * 2)).toEqual(new Right(2))
    })
    test("map shall not do nothing", () => {
        expect(left.map(_ => _)).toEqual(left)
    })
})

describe("flatMap", () => {
    test("flatMap shall transform the Option content and flat the result", () => {
        expect(right.flatMap(_ => new Right(_ * 2))).toEqual(new Right(2))
    })
    test("flatMap shall not do nothing", () => {
        expect(left.flatMap(_ => new Right(_ * 2))).toEqual(left)
    })
})

describe("toOption", () => {
    test("toOption shall convert to Some", () => {
        expect(right.toOption()).toEqual(new Some(1))
    })
    test("toOption shall convert to None", () => {
        expect(left.toOption()).toEqual(new None)
    })
})
