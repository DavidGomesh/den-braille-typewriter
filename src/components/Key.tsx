import React from 'react'

import '../../styles/components/keyboard/Key.css'

interface KeyProps {
    className: string,
    content: any
}

export default function Key({ className, content }: KeyProps) {
    return (<>
        <div className={'d-flex justify-content-center align-items-center ' + className}>{content}</div>
    </>)
}