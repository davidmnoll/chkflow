import * as React from 'react'
import './style.scss'
import * as Types from './types.d' 



const DefaultTreeHead: React.FC<Types.DefaultTreeHeadProps> = function (props: Types.DefaultTreeHeadProps) {
    const setAsRoot = () => {console.log('updatePathTo', props.nodePath); props.setPath([props.nodePath[props.nodePath.length - 1]])}
    const moveToHere = () => {console.log('updatePathTo', props.nodePath); props.setPath(props.nodePath)}
    return (<div className="head-container">
        <div onClick={moveToHere} onDoubleClick={setAsRoot} >
            &middot;
        </div>
        <div onClick={props.toggle}>
            {props.isCollapsed ? '[+]' : '[-]'}
        </div>
    </div>)
}
export default DefaultTreeHead