import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ChkFlow, {Types} from '../chk/ChkFlow'
import DefaultTreeNode from '../chk/DefaultTreeNode'
import DefaultContainer from '../chk/DefaultContainer'
import {
  trace, 
  traceQuiet,
  traceBreak,
  traceFunc
} from '../chk/Utils'

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

  const l2 = {
    '0' : { text: 'blah0', rel: {'child': ['1','3']}, isCollapsed: false },
    '1' : { text: 'blah1', rel: {'child': ['5', '2']}, isCollapsed: false  },
    '2' : { text: 'blah2', rel: {'child': ['4']}, isCollapsed: false  },
    '3' : { text: 'blah3', rel: {'child': []}, isCollapsed: false  },
    '4' : { text: 'blah4', rel: {'child': []}, isCollapsed: false  },
    '5' : { text: 'blah5', rel: {'child': ['6','7']}, isCollapsed: true  },
    '6' : { text: 'blah6', rel: {'child': []}, isCollapsed: false  },
    '7' : { text: 'blah7', rel: {'child': []}, isCollapsed: false  },
  }


  let environment = {
    homePath: [{rel:'root', id:'0'}, {rel:'child', id:'1'}] as Types.NodePath,
    activeNode: null
  }
  let state: Types.ChkFlowState = {
    environment: environment,
    nodes: l1,
    defaultNodes: l1,
    defaultEnvironment: environment,
    showDummies: false,
    nodeComponent: DefaultTreeNode,
    containerComponent: DefaultContainer,
    setStateCallback: ()=>{}
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
        let state: Types.ChkFlowState = {
            environment: environment,
            nodes: l2,
            defaultNodes: l2,
            defaultEnvironment: environment,
            showDummies: false,
            nodeComponent: DefaultTreeNode,
            containerComponent: DefaultContainer,
            setStateCallback: ()=>{}
          }
        render(<ChkFlow {...state} />)
        if (screen){
            let elem1 = screen.getByText(/blah5/i);
            let elem2 = elem1.closest('.node-container')
            expect(elem2).not.toHaveTextContent(/blah6/i)
            expect(elem2).not.toHaveTextContent(/blah7/i)
        }else {
            throw new Error("no screen")
        }
    })
})
