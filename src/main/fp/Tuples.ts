export type Tuple<A, B> = {
    first: A
    second: B
}

export function Tuple <A, B> (first: A, second: B): Tuple<A, B> {
    return ({ first, second })
}

export function fold <A, B, C> (f: (_1: A, _2: B) => C): (t: Tuple<A, B>) => C {
    return t => f(t.first, t.second)
}