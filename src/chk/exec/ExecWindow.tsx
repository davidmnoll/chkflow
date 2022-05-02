import * as React from 'react'
import { useState } from 'react'
import * as Types from '../types'
import styled from 'styled-components'
import { 
  Button,
 } from '@material-ui/core';

import { 
  ChevronRight,
  ArrowBackIos,
  ArrowForwardIos,
  ChangeHistory,
  Home,
  Cancel
  
 } from '@material-ui/icons';
import { Nothing } from 'purify-ts/Maybe';

import {
    Autocomplete 
} from '@material-ui/lab';
import {
   TextField 
} from '@material-ui/core';
import {
    UseAutocompleteProps
} from '@material-ui/lab/useAutocomplete';


import {
  pathCurrentLast
} from '../Utils'

const ExecContainer = styled.div`

 & {
   // border: 1px solid black;
   display: flex;
   flex-direction: column;
   font-size: 14px;
   padding: 5px;
   align-items: flex-start;
 }


 &>div.execute-button {

   font-size: 24px;
   vertical-align: middle;
 }

 `;

//Todo: create default header


const showComponentFromData = (componentData: Types.ComponentData, environment: Types.ChkFlowEnvironment) => (props: Types.DisplayNodeProps ): React.ReactElement[] => {

  console.log('showComponentFromData', componentData);
  const getChildElements = (data: Types.ComponentData[], environment: Types.ChkFlowEnvironment): React.ReactElement[] => {
    console.log('getChildElements', data);
    return data.map( (elemData, index) => React.createElement(
    elemData.type, 
    {key:index},
    elemData.children !== undefined ? getChildElements(elemData.children, environment) : elemData.contents
    ))
  }

  return getChildElements([componentData], environment);

}


const ExecWindow = (props: Types.ExecWindowProps) => { 

  const [relValue, setRelValue] = useState(props.relId);

  const maybeNodeData = props.getNodeInfo(props.nodePath);
  const maybeRelNodeData = props.getRelNodeInfo(props.nodePath);

  const getRelDisplayComponent = (rel: Types.ChkFlowNode, environment: Types.ChkFlowEnvironment) => {
    console.log('getRelDisplayComponent', rel);
    return (rel.data && rel.data.componentData !== undefined) ? showComponentFromData(rel.data.componentData, props.environment) : showComponentFromData({"type":"div", "children": [ {"type":"div", "contents": "Rel"}, {"type":"div", "contents": "{id}"}]}, props.environment);
  }


  console.log('ExecWindow props', maybeNodeData, maybeRelNodeData, props)
  const DisplayComponent = maybeRelNodeData.map(([_, rel]: [String, Types.ChkFlowNode]) => {
    console.log('ExecWindow DisplayComponent', rel);
    return getRelDisplayComponent(rel, props.environment)
  }).orDefaultLazy(() => {
    
    console.log('ExecWindow DisplayComponent Lazy Default', maybeNodeData);
    return showComponentFromData({"type":"div", "children": [ {"type":"div", "contents": "Rel"}, {"type":"div", "contents": "{id}"}]}, props.environment)
  })
   
  
  console.log('node IDs', props.relKeys)
  const autocompleteProps: UseAutocompleteProps<Types.NodeId, false, true, false> = {
    freeSolo: false,
    multiple: false,
    disableClearable: true,
    options: props.relKeys
  }

  return (
        <ExecContainer className="header-container">
            <div>
              <Autocomplete 
                {...autocompleteProps}
                value={props.relId}
                style={{ width: '200px' }}
                onChange={(event, value) => {props.updatePathRel(props.nodePath, value)}}
                renderInput={(params) => (<TextField
                        {...params}
                        variant="outlined"
                        InputProps={{ ...params.InputProps, type: 'search' }}
                        // defaultValue={props.relId}
                    />)}
              />
            </div>
            <div>
              <DisplayComponent />
                
            </div>
            <div>
              <Button 
                className="execute-button" 
                variant="contained"
                onClick={()=>props.evaluateNode(maybeNodeData, maybeRelNodeData)}
              >
                Execute
              </Button>
            </div>
        </ExecContainer>
  )
}




export default ExecWindow