import * as React from 'react'
import './style.scss'
import * as Types from './types.d' 
import { AddBox, 
    IndeterminateCheckBoxOutlined, 
    CheckBoxOutlineBlankOutlined, 
    ArrowDropDownCircle, 
    RadioButtonUnchecked, 
    Adjust } from '@material-ui/icons';


const DefaultTreeHead: React.FC<Types.DefaultTreeHeadProps> = function (props: Types.DefaultTreeHeadProps) {
    const setAsRoot = () => {console.log('updatePathTo', props.nodePath); props.setPath([props.nodePath[props.nodePath.length - 1]])}
    const moveToHere = () => {console.log('updatePathTo', props.nodePath); props.setPath(props.nodePath)}
    return (<div className="head-container">
        <div onClick={()=>props.toggle(props.nodePath)} className={props.hasChildren? "collapse-toggle": "collapse-toggle no-children"}>
            { !props.hasChildren ? 
                <CheckBoxOutlineBlankOutlined /> :  
                ( props.isCollapsed ? 
                    <AddBox className="collapsed" /> : 
                    <IndeterminateCheckBoxOutlined className="uncollapsed"/> )}
        </div>
        <div onClick={moveToHere} onDoubleClick={setAsRoot} className="menu-dot">
            <Adjust />
        </div>

    </div>)
}
export default DefaultTreeHead