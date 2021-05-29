import * as React from 'react'
import './style.scss'
import * as Types from './types' 




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
    return ( <div onClick={idClickFn} key={index}> &gt;{nodeId} &nbsp; </div>  )
  })
  
  const goHome = () => { props.setPath([props.homeNode]) }

  return (
    <div className="header-container">
        <div className="home-node-button" onClick={goHome}>
        &#91;&middot;&#93;
        </div>
        {history}
    </div>
  )
}




export default Header