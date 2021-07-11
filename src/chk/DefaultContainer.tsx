import * as React from 'react'
import './style.scss'
import * as Types from './types.d'
import * as R from 'ramda'

import { 
  ChevronRight,
  ArrowBackIos,
  ArrowForwardIos,
  ChangeHistory,
  Home,
  Cancel
  
 } from '@material-ui/icons';




//Todo: create default header

const DefaultContainer = (props: Types.ContainerProps) => { 
  
   
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
        <div className="header-container">
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
        </div>
        <div className="nodes-container">
          {props.children}
        </div>
      </div>
    </div>
  )
}




export default DefaultContainer