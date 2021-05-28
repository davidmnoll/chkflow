import * as React from 'react'
import './style.scss'
import * as Types from './types.d' 



const DefaultTreeTailEdit: React.FC<Types.DefaultTreeTailEditProps> = function (props: Types.DefaultTreeTailEditProps) {
    let textContainer: HTMLDivElement;
    const saveEdit = () => {  props.saveEdit({text: textContainer.textContent}) }

    return (<div 
        contentEditable="true"  
        ref={node=>{ if(node){textContainer = node}}} 
        onDoubleClick={saveEdit}
        suppressContentEditableWarning={true}
    >
        {props.nodeInfo.text} 
    </div>)
}
export default DefaultTreeTailEdit