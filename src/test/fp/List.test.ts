import List from "../../main/fp/List"
import { None, Some } from "../../main/fp/Option"
import { tuple } from "../../main/fp/Tuples"

const list123: List<number> = List.of([1, 2, 3])
const emptyList: List<number> = List.empty()

describe("isEmpty", () => {
    test("isEmpty must return false", () => {
        expect(list123.isEmpty()).toBeFalsy()
    })
    test("isEmpty must return true", () => {
        expect(emptyList.isEmpty()).toBeTruthy()
    })
})

describe("lenght", () => {
    test("isEmpty must return 3", () => {
        expect(list123.length()).toEqual(3)
    })
    test("isEmpty must return 0", () => {
        expect(emptyList.length()).toEqual(0)
    })
})

describe("htOption", () => {
    test("htOption must return a Some of a Tuple of the head and tail", () => {
        expect(list123.htOption()).toEqual(new Some(tuple(1, List.of([2, 3]))))
    })
    test("htOption must return None", () => {
        expect(emptyList.htOption()).toEqual(new None)
    })
})

describe("headOption", () => {
    test("headOption must return a Some of the first element", () => {
        expect(list123.headOption()).toEqual(new Some(1))
    })
    test("headOption must return None", () => {
        expect(emptyList.headOption()).toEqual(new None)
    })
})

describe("tailOption", () => {
    test("tailOption must return a Some of the tail list", () => {
        expect(list123.tailOption()).toEqual(new Some(List.of([2, 3])))
    })
    test("tailOption must return None", () => {
        expect(emptyList.tailOption()).toEqual(new None)
    })
})

describe("lastOption", () => {
    test("lastOption must return a Some of the last element", () => {
        expect(list123.lastOption()).toEqual(new Some(3))
    })
    test("lastOption must return None", () => {
        expect(emptyList.lastOption()).toEqual(new None)
    })
})

describe("foldLeft", () => {
    test("foldLeft must transform the list and invert it", () => {
        expect(list123.foldLeft(
            emptyList, (acc, n) => List.cons(n * 2, acc)
        )).toEqual(List.of([6, 4, 2]))
    })
})

describe("foldRight", () => {
    test("foldRight must transform the list and doesn't invert it", () => {
        expect(list123.foldRight(
            emptyList, (n, acc) => List.cons(n * 2, acc)
        )).toEqual(List.of([2, 4, 6]))
    })
})

describe("reverse", () => {
    test("reverse must reverse the list", () => {
        expect(list123.reverse()).toEqual(List.of([3, 2, 1]))
        expect(emptyList.reverse()).toEqual(emptyList)
    })
})


describe("appended", () => {
    test("appended must append the value", () => {
        expect(list123.appended(4)).toEqual(List.of([1, 2, 3, 4]))
        expect(emptyList.appended(4)).toEqual(List.of([4]))
        expect(emptyList.appended(4).appended(5)).toEqual(List.of([4, 5]))
    })
})

describe("appendedAll", () => {
    test("appendedAll must append the list", () => {
        expect(list123.appendedAll(List.of([4, 5]))).toEqual(List.of([1, 2, 3, 4, 5]))
        expect(emptyList.appendedAll(List.of([1, 2]))).toEqual(List.of([1, 2]))
        expect(emptyList.appendedAll(List.of([1, 2])).appendedAll(List.of([3]))).toEqual(List.of([1, 2, 3]))
    })
})

describe("prepended", () => {
    test("prepended must prepend the value", () => {
        expect(list123.prepended(4)).toEqual(List.of([4, 1, 2, 3]))
        expect(emptyList.prepended(4)).toEqual(List.of([4]))
        expect(emptyList.prepended(4).prepended(5)).toEqual(List.of([5, 4]))
    })
})

describe("prependedAll", () => {
    test("prependedAll must append the list", () => {
        expect(list123.prependedAll(List.of([4, 5]))).toEqual(List.of([4, 5, 1, 2, 3]))
        expect(emptyList.prependedAll(List.of([1, 2]))).toEqual(List.of([1, 2]))
        expect(emptyList.prependedAll(List.of([1, 2])).prependedAll(List.of([3]))).toEqual(List.of([3, 1, 2]))
    })
})

describe("map", () => {
    test("map must transform the list", () => {
        expect(list123.map(_ => _ * 2)).toEqual(List.of([2, 4, 6]))
    })
    test("map must do nothing", () => {
        expect(emptyList.map(_ => _ * 2)).toEqual(emptyList)
    })
})

describe("flatMap", () => {
    test("flatMap must transform the list", () => {
        expect(list123.flatMap(_ => List.of([_ * 2]))).toEqual(List.of([2, 4, 6]))
    })
    test("flatMap must do nothing", () => {
        expect(emptyList.flatMap(_ => List.of([_ * 2]))).toEqual(emptyList)
    })
})

describe("flatten", () => {
    test("flatten must remove the top containers", () => {
        expect(List.flatten(List.of([List.of([1, 2]), List.of([3])]))).toEqual(list123)
        expect(List.flatten(List.of([List.of([1, 2]), emptyList, List.of([3])]))).toEqual(list123)
        expect(List.flatten(List.of([emptyList]))).toEqual(emptyList)
    })
})

describe("contains", () => {
    test("contains must return true", () => {
        expect(list123.contains(1)).toBeTruthy()
        expect(list123.contains(2)).toBeTruthy()
        expect(list123.contains(3)).toBeTruthy()
    })
    test("contains must return false", () => {
        expect(emptyList.contains(1)).toBeFalsy()
        expect(list123.contains(4)).toBeFalsy()
    })
})

// describe("containsSlice", () => {
//     test("containsSlice must return true", () => {
//         expect(List.of([1, 2, 3, 4, 5]).containsSlice(List.of([2, 3]))).toBeTruthy()
//     })
//     test("containsSlice must return false", () => {
//         expect(List.of([1, 2, 3, 4, 5]).containsSlice(List.of([7, 8]))).toBeFalsy()
//         expect(emptyList.containsSlice(List.of([2, 3]))).toBeFalsy()
//     })
// })

describe("exists", () => {
    test("exists must return true", () => {
        expect(list123.exists(_ => _ == 1)).toBeTruthy()
        expect(list123.exists(_ => _ > 2)).toBeTruthy()
    })
    test("exists must return false", () => {
        expect(emptyList.exists(_ => _ == 1)).toBeFalsy()
        expect(list123.exists(_ => _ == 4)).toBeFalsy()
    })
})

describe("forAll", () => {
    test("forAll must return true", () => {
        expect(list123.forAll(_ => _ < 4)).toBeTruthy()
        expect(emptyList.forAll(_ => _ < 4)).toBeTruthy()
    })
    test("forAll must return false", () => {
        expect(list123.forAll(_ => _ < 3)).toBeFalsy()
    })
})

describe("find", () => {
    test("find must return a Some of 2", () => {
        expect(list123.find(_ => _ == 1)).toEqual(new Some(0))
        expect(list123.find(_ => _ == 2)).toEqual(new Some(1))
        expect(list123.find(_ => _ == 3)).toEqual(new Some(2))
        expect(List.of([1, 1, 2, 2, 3, 3]).find(_ => _ == 2)).toEqual(new Some(2))
    })
    test("find must return None", () => {
        expect(emptyList.find(_ => _ == 2)).toEqual(new None)
        expect(list123.find(_ => _ == 4)).toEqual(new None)
    })
})

describe("findLast", () => {
    test("findLast must return a Some of 1", () => {
        expect(list123.findLast(_ => _ == 1)).toEqual(new Some(0))
        expect(list123.findLast(_ => _ == 2)).toEqual(new Some(1))
        expect(list123.findLast(_ => _ == 3)).toEqual(new Some(2))
        expect(List.of([1, 1, 2, 2, 3, 3]).findLast(_ => _ == 2)).toEqual(new Some(3))
    })
    test("findLast must return None", () => {
        expect(emptyList.findLast(_ => _ < 3)).toEqual(new None)
        expect(list123.findLast(_ => _ > 3)).toEqual(new None)
    })
})

describe("count", () => {
    test("count must return 2", () => {
        expect(list123.count(_ => _ < 3)).toEqual(2)
    })
    test("count must return 0", () => {
        expect(emptyList.count(_ => _ < 3)).toEqual(0)
        expect(list123.count(_ => _ > 3)).toEqual(0)
    })
})

describe("filter", () => {
    test("filter must remove elements that doesn't match", () => {
        expect(list123.filter(_ => _ < 3)).toEqual(List.of([1, 2]))
    })
    test("filter must do nothing", () => {
        expect(emptyList.filter(_ => _ < 3)).toEqual(emptyList)
        expect(list123.filter(_ => _ < 4)).toEqual(list123)
    })
})

describe("partition", () => {
    test("partition must divide elements that match", () => {
        expect(list123.partition(_ => _ < 3)).toEqual(tuple(List.of([1, 2]), List.of([3])))
    })
    test("partition must do nothing", () => {
        expect(emptyList.partition(_ => _ < 3)).toEqual(tuple(emptyList, emptyList))
        expect(list123.partition(_ => _ > 3)).toEqual(tuple(emptyList, list123))
    })
})

describe("slice", () => {
    test("slice must divide elements the list", () => {
        expect(list123.slice(0, 1)).toEqual(List.of([1, 2]))
        expect(list123.slice(1, 2)).toEqual(List.of([2, 3]))
        expect(list123.slice(1, 1)).toEqual(List.of([2]))
        expect(list123.slice(0, 2)).toEqual(List.of([1, 2, 3]))
        expect(list123.slice(0, 3)).toEqual(List.of([1, 2, 3]))
    })
    test("slice must do nothing", () => {
        expect(emptyList.slice(0, 1)).toEqual(emptyList)
        expect(list123.slice(0, 5)).toEqual(list123)
        expect(list123.slice(3, 5)).toEqual(emptyList)
    })
})

describe("span", () => {
    test("span must divide elements the list", () => {
        expect(list123.span(_ => _ < 2)).toEqual(tuple(List.of([1]), List.of([2, 3])))
    })
    test("span must do nothing", () => {
        expect(emptyList.span(_ => _ < 2)).toEqual(tuple(emptyList, emptyList))
        expect(list123.span(_ => _ < 4)).toEqual(tuple(list123, emptyList))
        expect(list123.span(_ => _ > 4)).toEqual(tuple(emptyList, list123))
    })
})

describe("splitAt", () => {
    test("splitAt must divide elements the list", () => {
        expect(list123.splitAt(0)).toEqual(tuple(emptyList, List.of([1, 2, 3])))
        expect(list123.splitAt(1)).toEqual(tuple(List.of([1]), List.of([2, 3])))
        expect(list123.splitAt(2)).toEqual(tuple(List.of([1, 2]), List.of([3])))
    })
    test("splitAt must do nothing", () => {
        expect(emptyList.splitAt(1)).toEqual(tuple(emptyList, emptyList))
        expect(list123.splitAt(3)).toEqual(tuple(list123, emptyList))
    })
})

describe("take", () => {
    test("take must get 2 elements", () => {
        expect(list123.take(0)).toEqual(emptyList)
        expect(list123.take(1)).toEqual(List.of([1]))
        expect(list123.take(2)).toEqual(List.of([1, 2]))
    })
    test("take must do nothing", () => {
        expect(emptyList.take(2)).toEqual(emptyList)
        expect(list123.take(5)).toEqual(list123)
    })
})

describe("takeRight", () => {
    test("takeRight must get 2 elements", () => {
        expect(list123.takeRight(0)).toEqual(emptyList)
        expect(list123.takeRight(1)).toEqual(List.of([3]))
        expect(list123.takeRight(2)).toEqual(List.of([2, 3]))
    })
    test("takeRight must do nothing", () => {
        expect(emptyList.takeRight(2)).toEqual(emptyList)
        expect(list123.takeRight(5)).toEqual(list123)
    })
})

describe("takeWhile", () => {
    test("takeWhile must get 2 elements", () => {
        expect(list123.takeWhile(_ => _ % 2 == 1)).toEqual(List.of([1]))
        expect(list123.takeWhile(_ => _ < 3)).toEqual(List.of([1, 2]))
    })
    test("takeWhile must do nothing", () => {
        expect(emptyList.takeWhile(_ => _ % 2 == 1)).toEqual(emptyList)
        expect(list123.takeWhile(_ => _ > 5)).toEqual(emptyList)
    })
})

describe("takeWhileRight", () => {
    test("takeWhileRight must get 1 elements", () => {
        expect(list123.takeWhileRight(_ => _ % 2 == 1)).toEqual(List.of([3]))
        expect(list123.takeWhileRight(_ => _ > 1)).toEqual(List.of([2, 3]))
    })
    test("takeWhileRight must do nothing", () => {
        expect(emptyList.takeWhileRight(_ => _ % 2 == 1)).toEqual(emptyList)
        expect(list123.takeWhileRight(_ => _ > 5)).toEqual(emptyList)
    })
})

describe("drop", () => {
    test("drop must drop 2 elements", () => {
        expect(list123.drop(0)).toEqual(List.of([1, 2, 3]))
        expect(list123.drop(1)).toEqual(List.of([2, 3]))
        expect(list123.drop(2)).toEqual(List.of([3]))
        expect(list123.drop(3)).toEqual(emptyList)
    })
    test("drop must drop all elements", () => {
        expect(list123.drop(5)).toEqual(emptyList)
    })
    test("drop must do nothing", () => {
        expect(emptyList.drop(2)).toEqual(emptyList)
    })
})

describe("dropRight", () => {
    test("dropRight must drop 2 elements", () => {
        expect(list123.dropRight(0)).toEqual(List.of([1, 2, 3]))
        expect(list123.dropRight(1)).toEqual(List.of([1, 2]))
        expect(list123.dropRight(2)).toEqual(List.of([1]))
        expect(list123.dropRight(3)).toEqual(emptyList)
    })
    test("dropRight must drop all elements", () => {
        expect(list123.dropRight(5)).toEqual(emptyList)
    })
    test("dropRight must do nothing", () => {
        expect(emptyList.dropRight(2)).toEqual(emptyList)
    })
})

describe("dropWhile", () => {
    test("dropWhile must drop 2 elements", () => {
        expect(list123.dropWhile(_ => _ % 2 == 1)).toEqual(List.of([2, 3]))
        expect(list123.dropWhile(_ => _ < 3)).toEqual(List.of([3]))
    })
    test("dropWhile must drop all elements", () => {
        expect(list123.dropWhile(_ => _ < 5)).toEqual(emptyList)
    })
    test("dropWhile must do nothing", () => {
        expect(emptyList.dropWhile(_ => _ % 2 == 1)).toEqual(emptyList)
    })
})

describe("dropWhileRight", () => {
    test("dropWhileRight must drop 2 elements", () => {
        expect(list123.dropWhileRight(_ => _ > 1)).toEqual(List.of([1]))
        expect(list123.dropWhileRight(_ => _ > 2)).toEqual(List.of([1, 2]))
        expect(list123.dropWhileRight(_ => _ % 2 == 1)).toEqual(List.of([1, 2]))
    })
    test("dropWhileRight must drop all elements", () => {
        expect(list123.dropWhileRight(_ => _ < 5)).toEqual(emptyList)
    })
    test("dropWhileRight must do nothing", () => {
        expect(emptyList.dropWhileRight(_ => _ % 2 == 1)).toEqual(emptyList)
    })
})

describe("updated", () => {
    test("updated must add update element of the list", () => {
        expect(list123.updated(0, 4)).toEqual(List.of([4, 2, 3]))
        expect(list123.updated(1, 4)).toEqual(List.of([1, 4, 3]))
    })
})

describe("startsWith", () => {
    test("startsWith must return true", () => {
        expect(list123.startsWith(List.of([1, 2]))).toBeTruthy()
        expect(list123.startsWith(List.of([1, 2, 3]))).toBeTruthy()
        expect(emptyList.startsWith(emptyList)).toBeTruthy()
        expect(list123.startsWith(emptyList)).toBeTruthy()
    })
    test("startsWith must return false", () => {
        expect(emptyList.startsWith(List.of([1, 2]))).toBeFalsy()
        expect(list123.startsWith(List.of([2, 3]))).toBeFalsy()
    })
})

// describe("endsWith", () => {
//     test("endsWith must return true", () => {
//         expect(list123.endsWith(List.of([2, 3]))).toBeTruthy()
//         expect(list123.endsWith(List.of([1, 2, 3]))).toBeTruthy()
//         expect(emptyList.endsWith(emptyList)).toBeTruthy()
//     })
//     test("endsWith must return false", () => {
//         expect(emptyList.endsWith(List.of([2, 3]))).toBeFalsy()
//         expect(list123.endsWith(List.of([2, 3]))).toBeFalsy()
//     })
// })

// describe("zip", () => {
//     test("zip must create a List of Tuples", () => {
//         expect(list123.zip(List.of(["one", "two", "three"]))).toEqual(List.of([
//             tuple(1, "one"), tuple(2, "two"), tuple(3, "three")
//         ]))
//         expect(list123.zip(List.of(["one", "two"]))).toEqual(List.of([
//             tuple(1, "one"), tuple(2, "two")
//         ]))
//         expect(List.of([1, 2]).zip(List.of(["one", "two", "three"]))).toEqual(List.of([
//             tuple(1, "one"), tuple(2, "two"), tuple(3, "three")
//         ]))
//     })
//     test("zip must do nothing", () => {
//         expect(emptyList.zip(List.of(["one", "two", "three"]))).toEqual(emptyList)
//         expect(list123.zip(emptyList)).toEqual(emptyList)
//     })
// })

// describe("zipWithIndex", () => {
//     test("zipWithIndex must create a List of Tuples", () => {
//         expect(List.of(["a", "b", "c"]).zipWithIndex()).toEqual(List.of([
//             tuple("a", 1), tuple("b", 2), tuple("c", 3)
//         ]))
//     })
//     test("zipWithIndex must do nothing", () => {
//         expect(emptyList.zipWithIndex()).toEqual(emptyList)
//     })
// })