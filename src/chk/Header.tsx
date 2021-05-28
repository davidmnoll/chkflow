import * as React from 'react'
import './style.scss'
import * as Types from './types' 




//Todo: create default header

const Header: React.FC<Types.ChkFlowProps> = (props) => { 
  
  const getHistoryList = (index:number, list:number[]): number[] => {
    if (index == 0){
      return list.reverse()
    }
    list.push(props.rootPath[index])
    return getHistoryList(index - 1, list)
  }
  
  const history = props.rootPath.map((nodeId: Types.NodeId, index:number)=>{

    const clickFn = () => {props.setPath(getHistoryList(index, []))} 
    return ( <div onClick={clickFn} key={index}> &gt;{nodeId} &nbsp; </div>  )
  })
  
  return (
    <div className="header-container">
        {history}
    </div>
  )
}




export default Header