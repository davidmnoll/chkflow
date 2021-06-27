import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import ChkFlow, {Types} from '../chk/ChkFlow'

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
  rootPath: ['0', '1', '5'],
  rel: 'child',
  homeNode: ['0'],
}
let settings = {}
let nodes = {
  ...l1,
}


let props : Types.ChkFlowProps = {
  environment: environment,
  settings: settings,
  nodes: nodes,
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

  it('adds node below when pressing enter', () => {
      let props : Types.ChkFlowProps = {
          environment: environment,
          settings: settings,
          nodes: l1,
      }
      render(<ChkFlow {...props} />)
      let elem5 = document.getElementById('5');
      let elem5Children = elem5?.querySelector('.node-children');
      expect(elem5Children?.childElementCount).toEqual(2)
      let elem7text = screen?.getByText(/blah7/i);
      userEvent.type(elem7text,"test{del}{del}{del}{del}{del}{del}{del}")
      userEvent.type(elem7text,"{enter}")
      fireEvent.keyDown(document.activeElement as Element, { key: 'Enter', code: 'Enter' })
      elem5Children = elem5?.querySelector('.node-children');
      expect(elem5Children?.childElementCount).toEqual(3)
  })

  it('focuses & puts cursor in previous node when press up arrow', ()=>{
    let props : Types.ChkFlowProps = {
      environment: environment,
      settings: settings,
      nodes: l1,
    }
    render(<ChkFlow {...props} />)
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

  it('focuses & puts cursor in next node when press down arrow', ()=>{
    let props : Types.ChkFlowProps = {
      environment: environment,
      settings: settings,
      nodes: l1,
    }
    render(<ChkFlow {...props} />)
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
