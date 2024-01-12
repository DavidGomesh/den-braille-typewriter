import Option, { None, Some } from "./Option"

export default abstract class Either<A, B> {
    
    abstract fold <C> (fa: (_: A) => C, fb: (_: B) => C): C
    
    isLeft(): boolean {
        return this.fold(_ => true, _ => false)
    }
    
    isRight(): boolean {
        return this.fold(_ => false, _ => true)
    }

    getOrElse(other: B): B {
        return this.fold(_ => other, _ => _)
    }

    orElse(other: () => Either<A, B>): Either<A, B> {
        return this.fold(_ => other(), _ => new Right(_))
    }

    contains(elem: B): boolean {
        return this.fold(_ => false, _ => _ == elem)
    }

    exists(p: (_: B) => boolean): boolean {
        return this.fold(() => false, _ => p(_))
    }

    filterOrElse(p: (_: B) => boolean, zero: () => A): Either<A, B> {
        return this.fold(_ => this, _ => p(_) ? this : new Left(zero()))
    }

    map <C> (f: (_: B) => C): Either<A, C> {
        return this.fold(_ => new Left(_) as Either<A, C>, _ => new Right(f(_)))
    }
    
    flatMap <C> (f: (_: B) => Either<A, C>): Either<A, C> {
        return this.fold(_ => new Left(_), _ => f(_))
    }

    toOption(): Option<B> {
        return this.fold(_ => new None, _ => new Some(_)) as Option<B>
    }
}

// export function flatten <E1, A1> (e: Either<E1, Either<E1, A1>>): Either<E1, A1> { TODO() }

export class Left<A, B> extends Either<A, B> {
    constructor(public value: A) { super() }

    fold <C> (fa: (_: A) => C, fb: (_: B) => C): C {
        return fa(this.value)
    }
}

export class Right<A, B> extends Either<A, B> {
    constructor(public value: B) { super() }

    fold <C> (fa: (_: A) => C, fb: (_: B) => C): C {
        return fb(this.value)
    }
}