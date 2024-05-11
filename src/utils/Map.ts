import * as O from "fp-ts/lib/Option"
import { Option } from "fp-ts/lib/Option"
import { Map } from "immutable"

export function getOption <A, B> (m: Map<A, B>): (k: A) => Option<B> {
    return k => O.fromNullable(m.get(k, null))
}