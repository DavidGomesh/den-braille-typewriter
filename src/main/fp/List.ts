import Option, { None, Some } from "./Option"
import { Tuple2, tuple } from "./Tuples"
import TODO from "./Utils"

export default abstract class List<A> {
    
    static empty <B> () { return new Nil<B> }

    static of <B> (xs: B[]): List<B> {
        return xs.length == 0 ? new Nil : new Cons(xs[0], List.of(xs.slice(1)))
    }

    static cons <B> (head: B, tail: List<B>): List<B> {
        return new Cons(head, tail)
    }

    isEmpty(): boolean {
        return this instanceof Nil
    }

    length(): number {
        return this.foldLeft(0, (acc, _) => acc + 1)
    }

    htOption(): Option<Tuple2<A, List<A>>> {
        return this instanceof Cons ? new Some(tuple(this.head, this.tail)) : new None
    }

    headOption(): Option<A> {
        return this instanceof Cons ? new Some(this.head) : new None
    }

    tailOption(): Option<List<A>> { 
        return this instanceof Cons ? new Some(this.tail) : new None 
    }

    lastOption(): Option<A> {
        return this.reverse().headOption()
    }

    foldLeft <B> (z: B, f: (_1: B, _2: A) => B): B {
        return this instanceof Cons ? this.tail.foldLeft(f(z, this.head), f) : z
    }

    foldRight <B> (z: B, f: (_1: A, _2: B) => B): B {
        return this instanceof Cons ? f(this.head, this.tail.foldRight(z, f)) : z
    }

    reverse(): List<A> {
        return this.foldLeft(List.empty(), (acc, e) => List.cons(e, acc))
    }

    appended(x: A): List<A> {
        return this.foldRight(List.of([x]), (e, acc) => List.cons(e, acc))
    }
    
    appendedAll(xs: List<A>): List<A> {
        return this.foldRight(xs, (e, acc) => List.cons(e, acc))
    }

    prepended(x: A): List<A> {
        return List.cons(x, this)
    }

    prependedAll(xs: List<A>): List<A> {
        return xs.appendedAll(this)
    }

    map <B> (f: (_: A) => B): List<B> {
        return this.foldRight(List.empty(), (e, acc) => List.cons(f(e), acc))
    }
    
    flatMap <B> (f: (_: A) => List<B>): List<B> {
        return this.foldRight(List.empty(), (e, acc) => acc.prependedAll(f(e)))
    }

    static flatten <A> (xs: List<List<A>>): List<A> {
        return xs.flatMap(_ => _)
    }

    contains(elem: A): boolean {
        function loop(xs: List<A>): boolean {
            return xs instanceof Cons ? xs.head == elem || loop(xs.tail) : false
        }
        return loop(this)
    }

    containsSlice(that: List<A>): boolean {
        TODO()
    }

    exists(p: (_: A) => boolean): boolean {
        function loop(xs: List<A>): boolean {
            return xs instanceof Cons ? p(xs.head) || loop(xs.tail) : false
        }
        return loop(this)
    }
    
    forAll(p: (_: A) => boolean): boolean {
        return this.foldLeft(true, (acc, e) => acc && p(e))
    }

    find(p: (_: A) => boolean): Option<number> {
        function loop(n: number, xs: List<A>): Option<number> {
            return xs instanceof Cons ? p(xs.head) ? new Some(n) : loop(n + 1, xs.tail) : new None
        }
        return loop(0, this)
    }
    
    findLast(p: (_: A) => boolean): Option<number> {
        return this.foldLeft(tuple(0, new None<number>), (acc, x) => {
            return tuple(acc.first + 1, p(x) ? new Some(acc.first) : acc.second)
        }).second
    }

    count(p: (_: A) => boolean): number {
        return this.foldLeft(0, (acc, e) => p(e) ? acc + 1 : acc)
    }

    filter(p: (_: A) => boolean): List<A> {
        return this.foldRight(List.empty(), (x, acc) => p(x) ? List.cons(x, acc) : acc)
    }
    
    partition(p: (_: A) => boolean): Tuple2<List<A>, List<A>> {
        return this.foldLeft(tuple(List.empty(), List.empty()), (acc, x) => {
            return p(x) ? tuple(acc.first.appended(x), acc.second) : tuple(acc.first, acc.second.appended(x))
        })
    }

    slice(from: number, util: number): List<A> {
        function loop(n: number, xs: List<A>, r: List<A>) {
            if (n > util) { return r } else return xs instanceof Cons ? (
                loop(n + 1, xs.tail, from <= n ? r.appended(xs.head) : r)
            ) : r
        }
        return loop(0, this, List.empty())
    }

    span(p: (_: A) => boolean): Tuple2<List<A>, List<A>> {
        function loop(r: Tuple2<List<A>, List<A>>): Tuple2<List<A>, List<A>> {
            return r.second instanceof Cons && p(r.second.head) ? (
                loop(tuple(r.first.appended(r.second.head), r.second.tail))
            ) : r
        }
        return loop(tuple(List.empty(), this))
    }

    splitAt(n: number): Tuple2<List<A>, List<A>> {
        function loop(x: number, r: Tuple2<List<A>, List<A>>): Tuple2<List<A>, List<A>> {
            return r.second instanceof Cons && x < n ? (
                loop(x + 1, tuple(r.first.appended(r.second.head), r.second.tail))
            ) : r
        }
        return loop(0, tuple(List.empty(), this))
    }

    take(n: number): List<A> {
        function loop(x: number, r: List<A>, xs: List<A>): List<A> {
            return xs instanceof Cons && x < n ? (
                loop(x + 1, r.appended(xs.head), xs.tail)
            ) : r
        }
        return loop(0, List.empty(), this)
    }
    
    takeRight(n: number): List<A> {
        return this.drop(this.length() - n)
    }

    takeWhile(p: (_: A) => boolean): List<A> {
        function loop(r: List<A>, xs: List<A>): List<A> {
            return xs instanceof Cons && p(xs.head) ? (
                loop(r.appended(xs.head), xs.tail)
            ) : r
        }
        return loop(List.empty(), this)
    }

    takeWhileRight(p: (_: A) => boolean): List<A> {
        function loop(r: List<A>, xs: List<A>): List<A> {
            return xs instanceof Cons && p(xs.head) ? (
                loop(r.prepended(xs.head), xs.tail)
            ) : r
        }
        return loop(List.empty(), this.reverse())
    }

    drop(n: number): List<A> {
        function loop(x: number, r: List<A>): List<A> {
            return r instanceof Cons && x < n ? (
                loop(x + 1, r.tail)
            ) : r
        }
        return loop(0, this)
    }
    
    dropRight(n: number): List<A> {
        return this.take(this.length() - n)
    }

    dropWhile(p: (_: A) => boolean): List<A> {
        function loop(x: number, r: List<A>): List<A> {
            return r instanceof Cons && p(r.head) ? (
                loop(x + 1, r.tail)
            ) : r
        }
        return loop(0, this)
    }

    dropWhileRight(p: (_: A) => boolean): List<A> {
        function loop(r: List<A>): List<A> {
            return r instanceof Cons && p(r.head) ? (
                loop(r.tail)
            ) : r
        }
        return loop(this.reverse()).reverse()
    }

    updated(pos: number, elem: A): List<A> {
        function loop(i: number, r: List<A>, xs: List<A>): List<A> {
            return xs.htOption().fold(() => r, ht => (i == pos ? 
                r.appendedAll(ht.second.prepended(elem)) : loop(i + 1, r.prepended(ht.first), ht.second)
            ))
        }
        return loop(0, List.empty(), this)
    }

    startsWith(that: List<A>): boolean {
        if (this instanceof Cons) {
            if (that instanceof Cons) {
                return this.head == that.head ? this.tail.startsWith(that.tail) : false
            } else {
                return true
            }
        } else {
            return that instanceof Nil
        }
        
    }

    endsWith(that: List<A>): boolean {
        TODO()
    }

    zip <B> (that: List<B>): List<Tuple2<A, B>> {
        TODO()
    }

    zipWithIndex(): List<Tuple2<A, number>> {
        TODO()
    }
}


class Cons<A> extends List<A> {
    constructor(public head: A, public tail: List<A>) { super() }
}

class Nil<A> extends List<A> { }
