import React from 'react'

import '../styles/components/keyboard/Key.css'

interface KeyProps {
    className: string,
    content: any,
    reference: any,
}

export default function Key({ className, content, reference }: KeyProps) {
    return (<>
        <div ref={reference} className={'d-flex justify-content-center align-items-center ' + className}>{content}</div>
    </>)
}