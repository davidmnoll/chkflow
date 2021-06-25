import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
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
  // rel: 'children',
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

it('adds new node line on enter keypress at end of text ', () => {    
    render(<ChkFlow {...props} />)
    let elem = null;
    if (screen){
        let elem1 = screen.getByText(/blah5/i);
        let elem2 = elem1.closest('.node-container')
        console.log('parent elem',elem1)
        if (elem2){
            elem = elem2.querySelector(".node-children")
        }
    }
});
it('goes to next node on down keypress on bottom line of node ', () => {    
  render(<ChkFlow {...props} />)
  let elem = null;
  if (screen){
      let elem1 = screen.getByText(/blah5/i);
      let elem2 = elem1.closest('.node-container')
      console.log('parent elem',elem1)
      if (elem2){
          elem = elem2.querySelector(".node-children")
      }
  }
});