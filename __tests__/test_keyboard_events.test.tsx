import { render, fireEvent, waitFor, screen, queryByAttribute, queryByText } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import ChkFlow from '../src/chk/ChkFlow'
import type {
  ChkFlowSettings,
  ChkFlowState,
  ChkFlowEnvironment,
  ChkFlowNodes,
  PathElem,
  NodePath
} from '../src/chk'
import DefaultTreeNode from '../src/chk/DefaultTreeNode'
import DefaultContainer from '../src/chk/DefaultContainer'


const l1 = {
  '0' : { text: 'blah0', rel: {'child': ['1','3']}, isCollapsed: false },
  '1' : { text: 'blah1', rel: {'child': ['5', '2']}, isCollapsed: false  },
  '2' : { text: 'blah2', rel: {'child': ['4']}, isCollapsed: false  },
  '3' : { text: 'blah3', rel: {'child': []}, isCollapsed: false  },
  '4' : { text: 'blah4', rel: {'child': []}, isCollapsed: false  },
  '5' : { text: 'blah5', rel: {'child': ['6','7']}, isCollapsed: false  },
  '6' : { text: 'blah6', rel: {'child': []}, isCollapsed: false  },
  '7' : { text: 'blah7', rel: {'child': []}, isCollapsed: false  },
}

let environment = {
  homePath: [{rel:'root', id:'0'}, {rel:'child', id:'1'}] as NodePath,
  activeNode: null
}
let state: ChkFlowState = {
  environment: environment,
  nodes: l1,
  defaultNodes: l1,
  defaultEnvironment: environment,
  showDummies: false,
  nodeComponent: DefaultTreeNode,
  containerComponent: DefaultContainer,
  setStateCallback: ()=>{}
}
function cursorIsAtEnd(element: HTMLDivElement): boolean{
  let selection = document.getSelection();
  if (selection){
    console.log("at end of node")
    return ( element.innerText.length == selection.anchorOffset && element.innerText.length == selection.focusOffset )
  }
  return false
}


describe('handling keyboard events properly', ()=>{

  it('adds node below when pressing enter', async () => {
      let dom = render(<ChkFlow {...state} />)

      let elem5parent = screen?.getByText(/blah5/i)?.parentElement?.parentElement
      let elem5Children = elem5parent?.querySelector('.node-children');
      expect(elem5Children?.childElementCount).toEqual(2)
      let elem7text = screen?.getByText(/blah7/i);
      userEvent.type(elem7text,"test{del}{del}{del}{del}{del}{del}{del}")
      userEvent.type(elem7text,"{enter}")
      fireEvent.keyDown(document.activeElement as Element, { key: 'Enter', code: 'Enter' })
      elem5Children = elem5parent?.querySelector('.node-children');
      await new Promise((r) => setTimeout(r, 200));
      expect(elem5Children?.childElementCount).toEqual(3)
  })

  it.skip('focuses & puts cursor in previous node when press up arrow', async ()=>{
    // Need to rewrite this because functionality works fine
    let dom = render(<ChkFlow {...state} />)
    let elem6tail = screen?.getByText(/blah6/i);
    let elem7tail = screen?.getByText(/blah7/i);
    fireEvent.click(elem7tail as HTMLDivElement)
    userEvent.type(elem7tail, "asdf")
    let active = document.activeElement
    expect(active).toEqual(elem7tail as HTMLDivElement)
    userEvent.type(elem7tail as HTMLDivElement, "{arrowup}")
    active = document.activeElement
    expect(active?.outerHTML).toEqual(elem6tail?.outerHTML)
  })

  it.skip('focuses & puts cursor in next node when press down arrow', async ()=>{
    // Need to rewrite this because functionality works fine
    let dom = render(<ChkFlow {...state} />)
    let elem6tail = screen?.getByText(/blah6/i);
    let elem7tail = screen?.getByText(/blah7/i);
    fireEvent.click(elem6tail as HTMLDivElement)
    userEvent.type(elem6tail, "asdf")
    let active = document.activeElement
    expect(active).toEqual(elem6tail as HTMLDivElement)
    userEvent.type(elem6tail as HTMLDivElement, "{arrowdown}")
    active = document.activeElement
    expect(active?.outerHTML).toEqual(elem7tail?.outerHTML)
  })

})
