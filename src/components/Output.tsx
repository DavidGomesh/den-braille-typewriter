import { Option, none, some } from 'fp-ts/lib/Option'
import React from 'react'
import { Key } from '../domain/Key.ts'

export function insertAtSelectionStart(textarea: HTMLTextAreaElement): (_: string) => void {
    return newText => {
        const selectionStart = textarea.selectionStart
        const text = textarea.value || ""

        textarea.value = (
            text.substring(0, selectionStart) +
            newText +
            text.substring(selectionStart)
        )

        textarea.setSelectionRange(selectionStart + 1, selectionStart + 1)
    }
}

export enum CursorMoviment {
    UP, DOWN, RIGHT, LEFT
}

export function moveCursorBy(cursorMoviment: CursorMoviment): (_: HTMLTextAreaElement) => void {
    console.log('opa')
    return textarea => {
        let cursorPosition = textarea.selectionStart

        switch (cursorMoviment) {
            case CursorMoviment.UP: cursorPosition -= textarea.cols; break
            case CursorMoviment.DOWN: cursorPosition += textarea.cols; break
            case CursorMoviment.RIGHT: cursorPosition++; break
            case CursorMoviment.LEFT: cursorPosition--; break
        }

        cursorPosition = Math.max(0, Math.min(cursorPosition, textarea.value.length))
        textarea.setSelectionRange(cursorPosition, cursorPosition)
    }
}

export function keyToCursorMoviment(key: Key): Option<CursorMoviment> {
    switch (key) {
        case Key.ARROW_UP: return some(CursorMoviment.UP)
        case Key.ARROW_DOWN: return some(CursorMoviment.DOWN)
        case Key.ARROW_RIGHT: return some(CursorMoviment.RIGHT)
        case Key.ARROW_LEFT: return some(CursorMoviment.LEFT)
        default: return none
    }
}

export default function Output({ text }) {
    return (<>
        <textarea 
            id='test'
            className='form-control braille p-5 mb-3'
            readOnly={true}
            rows={3} 
            style={{
                height: '400px', 
                letterSpacing: '15px', 
                fontSize: '4rem'
            }} defaultValue={text}>
        </textarea>
    </>)
}