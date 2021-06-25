import * as React from 'react'
import './style.scss'
import * as Types from './types' 



const DefaultTreeTailEdit: React.FC<Types.DefaultTreeTailProps> = function (props: Types.DefaultTreeTailProps) {
    let textContainer: HTMLDivElement;
    const saveEdit = () => {  props.saveEdit({text: textContainer.textContent}) }
    console.log(props.getRelation(props.nodePath))

    function getSelectionTextInfo(el:HTMLElement) {
        var atStart = false, atEnd = false;
        var selRange, testRange;
        if (window.getSelection) {
            var sel = window.getSelection();
            if (sel){
                if (sel.rangeCount) {
                    selRange = sel.getRangeAt(0);
                    testRange = selRange.cloneRange();
        
                    testRange.selectNodeContents(el);
                    testRange.setEnd(selRange.startContainer, selRange.startOffset);
                    atStart = (testRange.toString() == "");
        
                    testRange.selectNodeContents(el);
                    testRange.setStart(selRange.endContainer, selRange.endOffset);
                    atEnd = (testRange.toString() == "");
                }    
            }
        } 
    
        return { atStart: atStart, atEnd: atEnd };
    }

    const keyDownListen = (event:React.KeyboardEvent) => {
        let {atStart, atEnd} = getSelectionTextInfo(textContainer)
        if (atStart){
            if (event.key === 'Tab' ){
                event.preventDefault()
                console.log('moveChild')
                props.moveUnderPreviousNode(props.nodePath)
                return false;
            }
        }
        if (atEnd){
            if (event.key == 'Enter' ){
                event.preventDefault()
                console.log('newChild')
                props.newChildUnderThisNode(props.nodePath)
            }
        }
    }


    return (<div 
        contentEditable="true"  
        ref={node=>{ if(node){textContainer = node}}} 
        onBlurCapture={saveEdit}
        suppressContentEditableWarning={true}
        onKeyDown={keyDownListen}
    >   
        {props.nodeInfo.text} 
    </div>)
}
export default DefaultTreeTailEdit