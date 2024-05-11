
import { List, Map } from "immutable"

import  { Option } from 'fp-ts/lib/Option'
import  * as O from 'fp-ts/lib/Option'

import { IO } from 'fp-ts/IO'
import * as _IO from 'fp-ts/IO'

import { log } from 'fp-ts/Console'

import { pipe } from 'fp-ts/lib/function'

describe('Test', () => {
    test('that', () => {

        // const data = process.stdin.on('data', (data: Buffer) => {
        //     return data.toString()
        // })

        let myLocalStorage: Map<string, string> = Map()

        function setItem(key: string, value: string): IO<void> {
            return () => { myLocalStorage = myLocalStorage.set(key, value) }
        }

        function getItem(key: string): IO<Option<string>> {
            // return () => O.fromNullable(myLocalStorage.get(key, null))
            return () => key === 'fn' ? O.fromNullable(myLocalStorage.get(key, null)) : O.none
        }

        function saveData(): IO<void> {
            return pipe(
                _IO.Do,
                _IO.bind('_1', () => setItem('fn', 'David')),
                _IO.bind('_2', () => setItem('ln', 'Gomesh')),
            )
        }

        function apply <A> (io: IO<A>): A {
            return io()
        }

        function getData(): IO<Option<string>> {
            return pipe(
                getItem('fn'), _IO.map(ofn => 
                    pipe(
                        ofn, O.flatMap(fn => 
                            pipe(
                                getItem('ln'), _IO.map(oln => 
                                    pipe(
                                        oln, 
                                        O.map(ln => `FN: ${fn}, LS: ${ln}`)
                                    )
                                ),
                                apply
                            )
                        )
                    )
                )
            )
        }
        
        function program() {
            return pipe (
                _IO.Do,
                _IO.bind('_', () => saveData()),
                _IO.bind('s', () => getData()),
                _IO.flatMap(({ s }) => log(s))
            )
        }

        // program()()

        // console.log(
        //     O.fromPredicate((n: number) => n > 10)(102)
        // )




    })
})


describe("Another", () => {
    test("that", () => {


        pipe(
            O.Do,
            O.bind('a', () => {
                console.log('Binding to a')
                return O.fromPredicate((n: number) => n < 10)(90)
            }),
            O.bind('b', () => {
                console.log('Binding to b')
                return O.fromPredicate((n: number) => n < 10)(90)
            }),
            O.map(({ a, b }) => {
                console.log('Mapping')
                return O.none
            })
        )

    })
})