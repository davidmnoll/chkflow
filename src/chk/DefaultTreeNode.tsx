
import React from 'react'
import * as Types from './types' 
import * as R from 'ramda'
import { AddBox, 
  IndeterminateCheckBoxOutlined, 
  CheckBoxOutlineBlankOutlined, 
  ArrowDropDownCircle, 
  RadioButtonUnchecked, 
  Adjust } from '@material-ui/icons';

const DefaultTreeNode = function<I,T>(props:Types.TreeNodeProps<I,T>){ 
  
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
                props.
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



  const TreeHead = props.settings.treeHeadComponent as React.ElementType
  const TreeTail = props.settings.treeTailComponent as React.ElementType

  const setAsRoot = () => {console.log('updatePathTo', props.nodePath); props.setPath([props.nodePath[props.nodePath.length - 1]])}
  const moveToHere = () => {console.log('updatePathTo', props.nodePath); props.setPath(props.nodePath)}

  // console.log('activeComp',props.activeNode, props.nodePath, (R.equals(props.activeNode, props.nodePath)))
  const hasChildren = !(props.isCollapsed || !props.children || !(props.children.length > 0))
  // console.log('active? ', props.activeNode, props.nodePath, R.equals(props.activeNode, props.nodePath))

  let textContainer: HTMLDivElement;
  const saveEdit = () => {  props.updateNode(props.nodePath, {text: textContainer.textContent}) }
  // console.log(props.getRelation(props.nodePath))

  return (
    <div className="node-container" id={props.nodePath[props.nodePath.length - 1]}>
      <div 
        className={ (R.equals(props.activeNode, props.nodePath)) ? "node-main active" :  "node-main"}
        onFocusCapture={() => {props.setActiveNode(props.nodePath)}}
        >
        <div className="head-container">
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

    </div>
    <div
        className="node-tail"
        contentEditable="true"  
        ref={node=>{ if(node){textContainer = node}}} 
        onBlurCapture={saveEdit}
        suppressContentEditableWarning={true}
        onKeyPress={keyPressListen}
        onKeyDown={keyDownListen}
    >   
        {props.nodeInfo.text} 
    </div>
      </div>
      <div className={hasChildren ? "node-children" : "node-children hidden"} >
        {  hasChildren ? props.children : ''}
      </div>
    </div>
  )  
    
}

export default DefaultTreeNode