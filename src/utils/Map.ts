import { Option, none, some } from "fp-ts/lib/Option"
import { Map } from "immutable"

export function getOption <A, B> (m: Map<A, B>): (k: A) => Option<B> {
    return k => (v => v === none ? v as Option<B> : some(v as B))(m.get(k, none))
}