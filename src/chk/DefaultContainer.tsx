import * as React from 'react'
import * as Types from './types.d'
import styled from 'styled-components'
import * as R from 'ramda'

import { 
  ChevronRight,
  ArrowBackIos,
  ArrowForwardIos,
  ChangeHistory,
  Home,
  Cancel
  
 } from '@material-ui/icons';


 const HeaderContainer = styled.div`

 & {
   // border: 1px solid black;
   display: flex;
   flex-direction: row;
   font-size: 24px;
   padding: 5px;
   align-items: center;
 }

 &>div.history {
   min-width: 200px;
   display: flex;
   flex-direction: row;
   align-items: center;
   vertical-align: middle;

 }

 &>div.history svg{
   vertical-align: middle;
 }
 &>div.history.node-link {
   vertical-align: middle;
   padding: 0px;
   font-size: 20px;
   color: rgba(33,33,33,1);
   font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
 }
 &>div.home-node-button {
   vertical-align: middle;
 }

 `;

//Todo: create default header

const DefaultContainer = (props: Types.ContainerProps) => { 
  
  console.log(props.environment)
  const relevantNodes = R.tail(props.environment.homePath as Types.NodePath); // Nodes except the root, which should be hidden
  const history = relevantNodes.map((value: Types.PathElem , index:number)=>{
    let nodeId = value.id;
    let subPath = [{id:'0', rel:'root'}] as Types.NodePath;
    for(let i=0; i < index; i++){
      subPath.push(relevantNodes[i])
    }
    const idClickFn = () => {props.setPath(subPath)}
    const text = props.nodes[nodeId].text
    return ( <div onClick={idClickFn} key={index}> <ChevronRight /> <span className="node-link">{text}</span> </div>  )
  })
  
  const goHome = () => { props.setPath([{id:'0', rel:'root'}]) }


  return (
    <div className="chkflow-container">
      <div className="chkflow-main">
        <HeaderContainer className="header-container">
          {/* <FontAwesomeIcon icon={faArrowAltCircleLeft} /> */}
          {/* <div className="back-button">
            <ArrowBackIos />
          </div> */}
          <div className="home-node-button" onClick={goHome}>
            <Home />
          </div>
          <div className="history">
            {history}
          </div>
          {/* <div className="forward-button">
            <ArrowForwardIos />
          </div> */}
          <div className="cancel-button" onClick={props.resetNodes}>
            <Cancel />
          </div>
        </HeaderContainer>
        <div className="nodes-container">
          {props.children}
        </div>
      </div>
    </div>
  )
}




export default DefaultContainer