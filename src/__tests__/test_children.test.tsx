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
    rootPath: ['0', '1', '5'],
    rel: 'child',
    homeNode: ['0'],
  }
  let settings = {}


describe('rendering children properly', ()=>{

    it('shows children if expanded', () => {
        let props : Types.ChkFlowProps = {
            environment: environment,
            settings: settings,
            nodes: l1,
        }
        render(<ChkFlow {...props} />)
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
        let props : Types.ChkFlowProps = {
            environment: environment,
            settings: settings,
            nodes: l2,
        }
        render(<ChkFlow {...props} />)
        let elem = null;
        if (screen){
            let elem1 = screen.getByText(/blah5/i);
            elem = elem1.closest('.node-container')
        }
        expect(elem).not.toHaveTextContent(/blah6/i)
        expect(elem).not.toHaveTextContent(/blah7/i)

    })


})
