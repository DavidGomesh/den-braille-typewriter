
export class Tuple2<A, B> {
    _1: A = this.first
    _2: B = this.second
    constructor(public first: A, public second: B) { }
}

export function tuple <A, B> (first: A, second: B): Tuple2<A, B> {
    return new Tuple2(first, second)
}

export class Tuple3<A, B, C> {
    _1: A = this.first
    _2: B = this.second
    _3: C = this.third
    constructor(public first: A, public second: B, public third: C) { }
}
