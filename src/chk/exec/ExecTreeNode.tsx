
import React, {useState} from 'react'
import type * as Types from '../types' 
import styled from 'styled-components'
import * as R from 'ramda'
import { AddBox, 
  IndeterminateCheckBoxOutlined, 
  CheckBoxOutlineBlankOutlined, 
  ArrowDropDownCircle, 
  RadioButtonUnchecked,
  LinkRounded,
  Adjust } from '@material-ui/icons';

import {
    Autocomplete 
} from '@material-ui/lab';
import {
   TextField 
} from '@material-ui/core';
import {
    UseAutocompleteProps
} from '@material-ui/lab/useAutocomplete';

  const NodeContainer = styled.div`
  & {
      font-size: 32px;
  }
  &>.node-main {
      display: flex;
      flex-direction: row;
      border: 1px solid white;
      align-items: center;
  }
  &>.node-main.active{
      border: 1px solid rgba(33,33,33,.5);
      background-color: rgba(33,33,33,.3);
  }
  &>.node-main.linking{
      border: 1px solid rgba(33,33,33,.5);
      background-color: rgba(99,33,22,.3);
  }
  &>div.node-main>div.node-tail {
      // border: 1px solid orange;
      padding: 3px;
      font-size: 20px;
      color: rgba(33,33,33,1);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      min-width: 300px;
      align-self: center;
      text-align: left;
  }
  & [contenteditable].node-tail {
      outline: 0px solid transparent;
  }
  
  &>.node-children {
      // border: 1px solid green;
      padding-left: 20px;
      transition: opacity 1300ms;
      opacity: 1;
  }
  &>.node-children.hidden {
      transition: opacity 1300ms;
      opacity: 0;
  }
  &.linking {
    border: 1px solid rgba(44,22,33,.5);
  }
  
  

`
const HeadContainer = styled.div`
  & {
      display: flex;
      flex-direction: row;
  }
  &>div.menu-dot>svg{
      // padding: 10px;
      fill: rgba(33,33,33,.3);
  }
  &>div.menu-dot:hover>svg{
      fill: rgba(33,33,33,.7);
  }
  &>div.collapse-toggle.no-children{
      color: rgba(33,33,33,.1);
  }
  &>div.collapse-toggle:hover{
      opacity: 1;
  }
  &>div.collapse-toggle{
      color: rgba(0,33,99,.5);
      opacity: .7;
  }
  &>div.collapse-toggle > .collapsed{
      transition: color 300ms;
      color: rgba(0,33,99,1);
      opacity: .7;
  }
`


const DefaultTreeNode = function(props:Types.TreeNodeProps){ 
  
 
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

    const saveEdit = async () => {  console.log("save", textContainer.textContent, props.nodeInfo); props.updateNode(props.nodePath, {...props.nodeInfo, text: textContainer.textContent ? textContainer.textContent : '' }) }

    const keyPressListen = async (event:React.KeyboardEvent) => {
        await saveEdit()
        let {atStart, atEnd} = getSelectionTextInfo(textContainer)
        if (atEnd){
            if (event.key == 'Enter' ){
                event.preventDefault()
                // console.log('newChild')
                props.newChildUnderThisNode(props.nodePath)
            }
        }
    }


    const keyDownListen = async (event:React.KeyboardEvent) => {
        let {atStart, atEnd} = getSelectionTextInfo(textContainer)
        if (atStart){
            if (event.key === 'Tab' ){
                await saveEdit()
                if (!event.shiftKey){
                    event.preventDefault()
                    // console.log('moveChildDown')
                    props.moveUnderPreviousNode(props.nodePath)
                    return false;
                }else{
                    event.preventDefault()
                    // console.log('moveChildUp')
                    props.moveUnderGrandParentBelowParent(props.nodePath)
                    return false;
                }
            }
        }

        if (event.key == "ArrowDown" ){
            await saveEdit()
            props.moveCursorToVisuallyNextNode(props.nodePath)
        }
        if (event.key == "ArrowUp"){
            await saveEdit()
            console.log("up")
            props.moveCursorToVisuallyPreviousNode(props.nodePath)
        }

    }


    function toggleCollapse(){
        let node = props.nodePath[props.nodePath.length - 1];
        console.log('node', node, props.nodePath)
        if (node){
            console.log('node', props.nodeInfo)
            props.updateNode(props.nodePath, {...props.nodeInfo, isCollapsed: !props.nodeInfo.isCollapsed } )
        }
    }


    const setAsRoot = () => {console.log('updatePathTo', props.nodePath); props.setPath([props.nodePath[props.nodePath.length - 1]])}
    const moveToHere = () => {console.log('updatePathTo', props.nodePath); props.setPath(props.nodePath)}

    // console.log('activeComp',props.activeNode, props.nodePath, (R.equals(props.activeNode, props.nodePath)))
    // console.log('active? ', props.activeNode, props.nodePath, R.equals(props.activeNode, props.nodePath))

    let textContainer: HTMLDivElement;
    // console.log(props.getRelation(props.nodePath))

    const autocompleteProps: UseAutocompleteProps<Types.NodeId, false, true, false> = {
        freeSolo: false,
        multiple: false,
        disableClearable: true,
        options: props.relKeys
    }


    const handleLinkAttempt = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault()
        console.log('link attempt', props.activeNode, props.pathElem.id)
        props.linkNode(props.activeNode, props.pathElem.id)
        // props.setIsLinking(false)
        return false
    }
    console.log('props', props)

    return (
        <NodeContainer className={"node-container"} id={props.pathElem.id} onClick={(e)=> props.isLinking && handleLinkAttempt(e)}>
        <div 
            className={ (R.equals(props.activeNode, props.nodePath)) ? "node-main active" :  props.isLinking ? "node-main linking" : "node-main"}
            onFocusCapture={() => {!props.isLinking && props.setActiveNode(props.nodePath)}}
            >
            <HeadContainer className="head-container">
                <div onClick={()=>{toggleCollapse()}} className={ props.children ? "collapse-toggle": "collapse-toggle no-children"}>
                    { props.nodeInfo.isCollapsed ?
                        <AddBox className="collapsed" /> :
                        ( !props.children ? 
                            <CheckBoxOutlineBlankOutlined /> :  
                            <IndeterminateCheckBoxOutlined className="uncollapsed"/> )}
                </div>
                <div onClick={moveToHere} onDoubleClick={setAsRoot} className="menu-dot">
                    <Adjust />
                </div>
                <Autocomplete 
                    {...autocompleteProps}
                    style={{ width: '130px', height: '20px', margin: '0' }}
                    value={props.relId}
                    // onChange={(event, value) => {setRelValue(value || '')}}
                    onChange={(event, value) => {props.updatePathRel(props.nodePath, value)}}
                    renderInput={(params) => (<TextField
                            {...params}
                            size='small'
                            style={{ margin: '0' }}
                            margin="normal"
                            variant="outlined"
                            InputProps={{ ...params.InputProps, type: 'search' }}
                        />)}
                />

            </HeadContainer>
            {props.nodeInfo.text === '' && <button
                onClick={() => props.setIsLinking(true)} 
            > <LinkRounded /></button>}
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
        <div className={props.children ? "node-children" : "node-children hidden"} >
            {  props.children ? props.children : ''}
        </div>
        </NodeContainer>
    )
}

export default DefaultTreeNode