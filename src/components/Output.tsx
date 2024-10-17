import React from 'react'

// export default function NOutput({ reference, text = "salve_o_corinthians\no_campeão_dos_campeões" }){
export default function NOutput({ reference, text = '', showBraille = true }){

    const bootstrapClasses = 'form-control p-5 mb-3'
    const brailleClass = showBraille ? 'braille' : ''

    return (<>
        <textarea
            className={`${bootstrapClasses} ${brailleClass}`}
            ref={reference}
            readOnly={false}
            rows={3}
            defaultValue={text}
            spellCheck={false}
            autoFocus={true}
            style={{
                height: '400px',
                letterSpacing: '15px',
                fontSize: '4rem',
                textWrap: 'wrap',
                overflowY: 'scroll',
                overflow: 'hidden',
            }}>
        </textarea>
    </>)
}

export function addTextToTextArea(text: string, textArea: HTMLTextAreaElement) {
    
    const selectionStart = textArea.selectionStart
    const value = textArea.value || ""

    textArea.value = (
        value.substring(0, selectionStart) + text +
        value.substring(selectionStart)
    )

    textArea.setSelectionRange(selectionStart+1, selectionStart+1)
}

export function getPreviousCharacter(textArea: HTMLTextAreaElement) {
    const cursorPosition = textArea.selectionStart || 0
    return cursorPosition != 0 ? textArea.value.charAt(cursorPosition-1) : null
}
