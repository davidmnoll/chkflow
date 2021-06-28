import * as React from 'react'
import './style.scss'
import * as Types from './types' 


const DefaultTreeTailEdit: React.FC<Types.DefaultTreeTailProps> = function (props: Types.DefaultTreeTailProps) {
    let textContainer: HTMLDivElement;
    const saveEdit = () => {  props.saveEdit({text: textContainer.textContent}) }
    // console.log(props.getRelation(props.nodePath))

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

    const keyPressListen = (event:React.KeyboardEvent) => {
        let {atStart, atEnd} = getSelectionTextInfo(textContainer)
        if (atEnd){
            if (event.key == 'Enter' ){
                event.preventDefault()
                // console.log('newChild')
                props.newChildUnderThisNode(props.nodePath)
            }
        }
    }

    
    const keyDownListen = (event:React.KeyboardEvent) => {
        let {atStart, atEnd} = getSelectionTextInfo(textContainer)
        if (atStart){
            if (event.key === 'Tab' ){
                if (!event.shiftKey){
                    event.preventDefault()
                    // console.log('moveChildDown')
                    props.moveUnderPreviousNode(props.nodePath)
                    return false;
                }else{
                    event.preventDefault()
                    // console.log('moveChildUp')
                    props.moveUnderParent(props.nodePath)
                    return false;
                }
            }
        }

        if (event.key == "ArrowDown" ){
            props.moveCursorToVisuallyNextNode(props.nodePath)
        }
        if (event.key == "ArrowUp"){
            console.log("up")
            props.moveCursorToVisuallyPreviousNode(props.nodePath)
        }

    }


    return (<div
        className="node-tail"
        contentEditable="true"  
        ref={node=>{ if(node){textContainer = node}}} 
        onBlurCapture={saveEdit}
        suppressContentEditableWarning={true}
        onKeyPress={keyPressListen}
        onKeyDown={keyDownListen}
    >   
        {props.nodeInfo.text} 
    </div>)
}
export default DefaultTreeTailEdit