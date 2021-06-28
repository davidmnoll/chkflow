import * as React from 'react'
import './style.scss'
import * as Types from './types' 
import { 
  ChevronRight,
  ArrowBackIos,
  ArrowForwardIos,
  ChangeHistory,
  Home,
  Cancel
  
 } from '@material-ui/icons';





//Todo: create default header

const Header: React.FC<Types.ChkFlowProps> = (props: any) => { 
  
  const getHistoryList = (index:number, list:number[]): number[] => {
    if (index < 0){
      return list.reverse()
    }
    list.push(props.rootPath[index])
    return getHistoryList(index - 1, list)
  }
  
  const history = props.rootPath.map((nodeId: Types.NodeId, index:number)=>{

    const idClickFn = () => {props.setPath(getHistoryList(index, []))} 
    return ( <div onClick={idClickFn} key={index}> <ChevronRight /> <span className="node-link">{nodeId}</span> </div>  )
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