import { List } from "immutable";
import { Tuple } from "./Tuples.ts";
import { pipe } from "fp-ts/lib/function";
import { spanLeft } from "fp-ts/lib/ReadonlyArray";
import { Option, none, some } from "fp-ts/lib/Option";

export function span <A> (p: (_: A) => boolean): (xs: List<A>) => Tuple<List<A>, List<A>> {
    return xs => pipe(spanLeft(p)(xs.toArray()), s => Tuple(List(s.init), List(s.rest)))
}

export function htOption <A> (xs: List<A>): Option<Tuple<A, List<A>>> {
    return xs.isEmpty() ? none : some(Tuple(xs.first(), xs.rest()))
}
