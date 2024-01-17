export default abstract class Option<A> {

    fold <B> (ifEmpty: () => B, f: (_: A) => B): B {
        return this instanceof Some ? f(this.value) : ifEmpty()
    }

    isDefined(): boolean {
        return this.fold(() => false, _ => true)
    }

    isEmpty(): boolean {
        return this.fold(() => true, _ => false)
    }

    getOrElse(other: A): A {
        return this.fold(() => other, _ => _)
    }

    orElse(alternative: () => Option<A>): Option<A> {
        return this.fold(alternative, _ => new Some(_))
    }

    contains(elem: A): boolean {
        return this.fold(() => false, _ => _ === elem)
    }

    exists(p: (_: A) => boolean): boolean {
        return this.fold(() => false, _ => p(_))
    }

    filter(p: (_: A) => boolean): Option<A> {
        return this.fold(() => new None, _ => p(_) ? this : new None) as Option<A>
    }

    map <B> (f: (_: A) => B): Option<B> {
        return this.fold(() => new None, _ => new Some(f(_)))
    }

    flatMap <B> (f: (_: A) => Option<B>): Option<B> {
        return this.fold(() => new None, _ => f(_))
    }
}

export function flatten <A> (o: Option<Option<A>>): Option<A> {
    return o.getOrElse(new None as Option<A>)
}

export class Some<A> extends Option<A> {
    constructor(public value: A) { super() }
}

export class None<A> extends Option<A> {}