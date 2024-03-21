import { Option, none, some } from "fp-ts/lib/Option"
import { Map } from "immutable"

export function getOption <A, B> (k: A): (m: Map<A, B>) => Option<B> {
    return m => (v => v === none ? v as Option<B> : some(v as B))(m.get(k, none))
}