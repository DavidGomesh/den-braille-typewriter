import React from 'react'

// export default function NOutput({ reference, text = "salve_o_corinthians\no_campeão_dos_campeões" }){
export default function NOutput({ reference, text = "" }){
    return (<>
        <textarea
            id='test'
            className='form-control braille p-5 mb-3'
            ref={reference}
            readOnly={false}
            rows={3}
            defaultValue={text}
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
