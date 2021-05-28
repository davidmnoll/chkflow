import * as React from 'react'
import './style.scss'
import * as Types from './types.d' 



const DefaultTreeTailDisplay: React.FC<Types.DefaultTreeTailDisplayProps> = function (props: Types.DefaultTreeTailDisplayProps) {

    return (<div onDoubleClick={props.startEdit}>
        {props.nodeInfo.text}
    </div>)
}
export default DefaultTreeTailDisplay