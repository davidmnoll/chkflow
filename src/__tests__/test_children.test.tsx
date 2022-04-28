import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ChkFlow from '../chk/ChkFlow'
import DefaultTreeNode from '../chk/default/DefaultTreeNode'
import DefaultContainer from '../chk/default/DefaultContainer'
import type {
  ChkFlowSettings,
  ChkFlowState,
  ChkFlowEnvironment,
  ChkFlowNodes,
  PathElem,
  NodePath
} from '../chk'

const l1 = {
    '0' : { text: 'blah0', rel: {'child': ['1','3']}, data: {}, isCollapsed: false },
    '1' : { text: 'blah1', rel: {'child': ['5', '2']}, data: {}, isCollapsed: false  },
    '2' : { text: 'blah2', rel: {'child': ['4']}, data: {}, isCollapsed: false  },
    '3' : { text: 'blah3', rel: {'child': []}, data: {}, isCollapsed: false  },
    '4' : { text: 'blah4', rel: {'child': []}, data: {}, isCollapsed: false  },
    '5' : { text: 'blah5', rel: {'child': ['6','7']}, data: {}, isCollapsed: false  },
    '6' : { text: 'blah6', rel: {'child': []}, data: {}, isCollapsed: false  },
    '7' : { text: 'blah7', rel: {'child': []}, data: {}, isCollapsed: false  },
  }

  const l2 = {
    '0' : { text: 'blah0', rel: {'child': ['1','3']}, data: {}, isCollapsed: false },
    '1' : { text: 'blah1', rel: {'child': ['5', '2']}, data: {}, isCollapsed: false  },
    '2' : { text: 'blah2', rel: {'child': ['4']}, data: {}, isCollapsed: false  },
    '3' : { text: 'blah3', rel: {'child': []}, data: {}, isCollapsed: false  },
    '4' : { text: 'blah4', rel: {'child': []}, data: {}, isCollapsed: false  },
    '5' : { text: 'blah5', rel: {'child': ['6','7']}, data: {}, isCollapsed: true  },
    '6' : { text: 'blah6', rel: {'child': []}, data: {}, isCollapsed: false  },
    '7' : { text: 'blah7', rel: {'child': []}, data: {}, isCollapsed: false  },
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
    setStateCallback: ()=>{}, 
    execEnabled: false
  }
describe('rendering children properly', ()=>{

    it('shows children if expanded', () => {
      render(<ChkFlow {...state} />)
      let elem = null;
      if (screen){
        let elem1 = screen.getByText(/blah5/i);
        let elem2 = elem1.closest('.node-container')
        if (elem2){
          elem = elem2.querySelector(".node-children")
        }
      }
      expect(elem).toHaveTextContent(/blah6/i)
      expect(elem).toHaveTextContent(/blah7/i)

    });

    it('does not show children if not expanded', () => {
      let state: ChkFlowState = {
        environment: environment,
        nodes: l2,
        defaultNodes: l2,
        defaultEnvironment: environment,
        showDummies: false,
        nodeComponent: DefaultTreeNode,
        containerComponent: DefaultContainer,
        setStateCallback: ()=>{},
        execEnabled: false
      }
      render(<ChkFlow {...state} />)
      let elem1 = screen?.getByText(/blah5/i);
      let elem2 = elem1?.closest('.node-container')
      expect(elem2).not.toHaveTextContent(/blah6/i)
      expect(elem2).not.toHaveTextContent(/blah7/i)
    })
})
