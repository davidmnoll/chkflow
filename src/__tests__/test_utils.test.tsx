
import { getVisuallyNextNodePath, 
    getVisuallyPreviousNodePath, 
    delArrayPrefix,
    moveUnderParent,
    getSubs
  } from '../chk/Utils'
import ChkFlow, {Types} from '../chk/ChkFlow'
import DefaultTreeNode from '../chk/DefaultTreeNode'
import DefaultContainer from '../chk/DefaultContainer'

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
    '5' : { text: 'blah5', rel: {'child': ['6','7']}, isCollapsed: false  },
    '6' : { text: 'blah6', rel: {'child': []}, isCollapsed: false  },
    '7' : { text: 'blah7', rel: {'child': []}, isCollapsed: false  },
}
let environment1 = {
    homePath: [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}] as Types.NodePath,
    activeNode: null
}
let environment2 = {
    homePath: [{rel:'root', id:'0'}, {rel:'child', id:'1'}] as Types.NodePath,
    activeNode: null
}
let state1: Types.ChkFlowState = {
    environment: environment1,
    nodes: l1,
    defaultNodes: l1,
    defaultEnvironment: environment1,
    showDummies: false,
    nodeComponent: DefaultTreeNode,
    containerComponent: DefaultContainer,
    setStateCallback: ()=>{}
}
let state2: Types.ChkFlowState = {
    environment: environment2,
    nodes: l2,
    defaultNodes: l2,
    defaultEnvironment: environment2,
    showDummies: false,
    nodeComponent: DefaultTreeNode,
    containerComponent: DefaultContainer,
    setStateCallback: ()=>{}
}

describe('properly runs node utilies & operations', ()=>{


    it('gets child paths from node & state', ()=>{
        getSubs(state1, [{rel:'root', id:'0'}]).handle( (subs : Types.NodePath[]) => {
            expect(subs).toEqual([[{rel:'root', id:'0'}, {rel:'child', id:'1'}],[{rel:'root', id:'0'}, {rel:'child', id:'3'}]])
        }).throw()
        getSubs(state1, [{rel:'root', id:'0'}, {rel:'child', id:'1'}]).handle( (subs : Types.NodePath[]) => {
            expect(subs).toEqual([[{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}], [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'2'}]])
        }).throw()


    })

    it('gets array remainder', ()=>{
        let a1 = [1,2,3]
        let a2 = [1,2,3,4,5]
        // console.log('delArrayPre',a1, a2, delArrayPrefix(a1,a2))
        expect(delArrayPrefix(a1,a2)).toEqual([4,5])
        a1 = [1,2,3]
        a2 = [1,2,3]
        // console.log('delArrayPre',a1, a2, delArrayPrefix(a1,a2))
        expect(delArrayPrefix(a1,a2)).toEqual([])
        a1 = [1,2,3]
        a2 = [1,2,4]
        // console.log('delArrayPre',a1, a2, delArrayPrefix(a1,a2))
        expect(delArrayPrefix(a1,a2)).toEqual(null)
        a1 = [1,2,3]
        a2 = [1,2]
        // console.log('delArrayPre',a1, a2, delArrayPrefix(a1,a2))
        expect(delArrayPrefix(a1,a2)).toEqual(null)

    })


    it('gets next node from path', () => {
        expect(getVisuallyNextNodePath(state1, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}]).dump())
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'6'}])
        expect(getVisuallyNextNodePath(state1, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'6'}]).trace().dump(true))
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'7'}])
        expect(getVisuallyNextNodePath(state1, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'7'}]).dump())
            .toEqual(null)

        expect(getVisuallyNextNodePath(state2, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}]).dump())
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'6'}])
        expect(getVisuallyNextNodePath(state2, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'6'}]).dump())
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'7'}])
        expect(getVisuallyNextNodePath(state2, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'7'}]).dump())
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'2'}])
        
    })

    it('gets previous node from path', () => {
        expect(getVisuallyPreviousNodePath(state1, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}]).dump()).toEqual(null)
        expect(getVisuallyPreviousNodePath(state1, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'6'}]).dump())
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}])
        expect(getVisuallyPreviousNodePath(state1, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'7'}]).dump())
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'6'}])
        expect(getVisuallyPreviousNodePath(state2, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}]).dump())
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'1'}])
        expect(getVisuallyPreviousNodePath(state2, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'6'}]).dump())
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'},])
        expect(getVisuallyPreviousNodePath(state2, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'7'}]).dump())
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'6'}])

        //Get last child of (last child of last child of etc.) previous sibling
        expect(getVisuallyPreviousNodePath(state2, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'2'}]).dump())
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'7'}])
        
    })

    it.skip('moves node below parent in parent\'s list', ()=>{
        let environment = {
            rootPath: ['0', '1', '5'],
            rel: 'child',
            homeNode: ['0'],
        }            
        let props : Types.ChkFlowProps = {
            environment: environment,
            settings: settings,
            nodes: l1,
        }
        expect(moveUnderParent(props, ["0","1","5"])).toEqual(null)
        expect(getVisuallyPreviousNodePath(props, ["0","1","5","6"])).toEqual(["0","1","5"])
        expect(getVisuallyPreviousNodePath(props, ["0","1","5","7"])).toEqual(["0","1","5","6"])

        environment = {
            rootPath: ['0', '1'],
            rel: 'child',
            homeNode: ['0'],
        }            
        props = {
            environment: environment,
            settings: settings,
            nodes: l1,
        }
        expect(getVisuallyPreviousNodePath(props, ["0","1", "5"])).toEqual(["0","1"])
        expect(getVisuallyPreviousNodePath(props, ["0","1","5","6"])).toEqual(["0","1","5",])
        expect(getVisuallyPreviousNodePath(props, ["0","1","5","7"])).toEqual(["0","1","5","6"])


    })

})