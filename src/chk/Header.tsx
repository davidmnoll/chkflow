import * as React from 'react'
import './style.scss'
import * as Types from './types'
import * as R from 'ramda'
import { 
  ChevronRight,
  ArrowBackIos,
  ArrowForwardIos,
  ChangeHistory,
  Home,
  Cancel
  
 } from '@material-ui/icons';
import { getNodeIdFromString } from './Utils'




//Todo: create default header

const Header: React.FC = (props: any) => { 
  
  const getHistoryList = (index:number, list:number[]): number[] => {
    if (index < 0){
      return list.reverse()
    }
    list.push(props.rootPath[index])
    return getHistoryList(index - 1, list)
  }
  
  const history = R.tail(props.rootPath as Array<string>).map((value: string , index:number)=>{
    let nodeId = getNodeIdFromString(value);
    const idClickFn = () => {props.setPath(getHistoryList(index, []))}
    const text = props.nodes[nodeId].text
    return ( <div onClick={idClickFn} key={index}> <ChevronRight /> <span className="node-link">{text}</span> </div>  )
  })
  
  const goHome = () => { props.setPath([props.homeNode]) }

  return (
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
  )
}




export default Header