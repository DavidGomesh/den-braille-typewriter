import React from 'react'

export default function Output({ text = "" }) {
    return (<>
        <textarea
            id='test'
            className='form-control braille p-5 mb-3'
            readOnly={false}
            rows={3}
            defaultValue={text}
            style={{
                height: '400px',
                letterSpacing: '15px',
                fontSize: '4rem',
                textWrap: 'wrap',
                overflowY: 'scroll',
            }}>
        </textarea>
    </>)
}



// It has side effects
export function addText(text: string): (textArea: HTMLTextAreaElement) => void {
    return textArea => {
        const selectionStart = textArea.selectionStart
        const value = textArea.value || ""

        textArea.value = (
            value.substring(0, selectionStart) + text +
            value.substring(selectionStart)
        )

        textArea.setSelectionRange(selectionStart+1, selectionStart+1)
    }
}
