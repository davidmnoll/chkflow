import * as React from 'react'
import './style.scss'
import * as Types from './types.d' 



const DefaultTreeHead: React.FC<Types.DefaultTreeHeadProps> = function (props: Types.DefaultTreeHeadProps) {

    return (<div onClick={props.toggle}>
        {props.isCollapsed ? '(+)' : '(-)'
        }
    </div>)
}
export default DefaultTreeHead