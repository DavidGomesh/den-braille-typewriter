import Option, { None, Some, flatten } from "../../fp/Option"

const some: Option<number> = new Some(1)
const none: Option<number> = new None

describe("fold", () => {
    test("fold result must be true", () => {
        expect(some.fold(() => false, _ => true)).toBeTruthy()
    })
    test("fold result must be false", () => {
        expect(none.fold(() => false, _ => true)).toBeFalsy()
    })
})

describe("isDefined", () => {
    test("isDefined must return true", () => {
        expect(some.isDefined()).toBeTruthy()
    })
    test("isDefined must return false", () => {
        expect(none.isDefined()).toBeFalsy()
    })
})

describe("isEmpty", () => {
    test("isEmpty must return true", () => {
        expect(none.isEmpty()).toBeTruthy()
    })
    test("isEmpty must return false", () => {
        expect(some.isEmpty()).toBeFalsy()
    })
})

describe("getOrElse", () => {
    test("getOrElse must return the original value", () => {
        expect(some.getOrElse(99)).toEqual(1)
    })
    test("getOrElse must return the alternative value", () => {
        expect(none.getOrElse(99)).toEqual(99)
    })
})

describe("orElse", () => {
    test("orElse must return the original Option", () => {
        expect(some.orElse(() => new Some(99))).toEqual(some)
    })
    test("orElse must return the alternative Option", () => {
        expect(none.orElse(() => new Some(99))).toEqual(new Some(99))
    })
})

describe("contains", () => {
    test("contains must return true", () => {
        expect(some.contains(1)).toBeTruthy()
    })
    test("contains must return false", () => {
        expect(some.contains(99)).toBeFalsy()
        expect(none.contains(1)).toBeFalsy()
    })
})

describe("exists", () => {
    test("exists must return true", () => {
        expect(some.exists(_ => _ == 1)).toBeTruthy()
    })
    test("exists must return false", () => {
        expect(some.exists(_ => _ == 99)).toBeFalsy()
        expect(none.exists(_ => _ == 1)).toBeFalsy()
    })
})

describe("filter", () => {
    test("filter must return the original Option", () => {
        expect(some.filter(_ => _ == 1)).toEqual(some)
    })
    test("filter must return false", () => {
        expect(some.filter(_ => _ == 99)).toEqual(none)
        expect(none.filter(_ => _ == 1)).toEqual(none)
    })
})

describe("map", () => {
    test("map shall transform the Option content", () => {
        expect(some.map(_ => _ * 2)).toEqual(new Some(2))
    })
    test("map shall not do nothing", () => {
        expect(none.map(_ => _)).toEqual(none)
    })
})

describe("flatMap", () => {
    test("flatMap shall transform the Option content and flat the result", () => {
        expect(some.flatMap(_ => new Some(_ * 2))).toEqual(new Some(2))
    })
    test("flatMap shall not do nothing", () => {
        expect(none.flatMap(_ => new Some(_))).toEqual(none)
    })
})

describe("flatten", () => {
    test("flatten shall transform Option<Option<A>> to Option<A>", () => {
        expect(flatten(new Some(some))).toEqual(some)
        expect(flatten(new Some(none))).toEqual(none)
    })
    test("flatten shall not do nothing", () => {
        expect(flatten(new None as Option<Option<number>>)).toEqual(none)
    })
})