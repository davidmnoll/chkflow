
import { getVisuallyNextNodePath, 
    getVisuallyPreviousNodePath, 
    delArrayPrefix,
    moveUnderParent,
    getSubs,
    moveUnderPreviousNode
} from '../chk/Utils'
import type {
    ChkFlowSettings,
    ChkFlowState,
    ChkFlowEnvironment,
    ChkFlowNodes,
    PathElem,
    NodePath
} from '../chk'
import ChkFlow from '../chk/ChkFlow'
import DefaultTreeNode from '../chk/default/DefaultTreeNode'
import DefaultContainer from '../chk/default/DefaultContainer'

const l1 = {
    '0' : { text: 'blah0', rel: {'child': ['1','3']}, data: {},  isCollapsed: false },
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
    '5' : { text: 'blah5', rel: {'child': ['6','7']}, data: {}, isCollapsed: false  },
    '6' : { text: 'blah6', rel: {'child': []}, data: {}, isCollapsed: false  },
    '7' : { text: 'blah7', rel: {'child': []}, data: {}, isCollapsed: false  },
}
const l3 = {
    '0' : { text: 'blah0', rel: {'child': ['1','3']}, data: {}, isCollapsed: false },
    '1' : { text: 'blah1', rel: {'child': ['5','6','2']}, data: {}, isCollapsed: false  },
    '2' : { text: 'blah2', rel: {'child': ['4']}, data: {}, isCollapsed: false  },
    '3' : { text: 'blah3', rel: {'child': []}, data: {}, isCollapsed: false  },
    '4' : { text: 'blah4', rel: {'child': []}, data: {}, isCollapsed: false  },
    '5' : { text: 'blah5', rel: {'child': ['7']}, data: {}, isCollapsed: false  },
    '6' : { text: 'blah6', rel: {'child': []}, data: {}, isCollapsed: false  },
    '7' : { text: 'blah7', rel: {'child': []}, data: {}, isCollapsed: false  },
}
const l4 = {
    '0' : { text: 'blah0', rel: {'child': ['1','3']}, data: {}, isCollapsed: false },
    '1' : { text: 'blah1', rel: {'child': ['5', '2']}, data: {}, isCollapsed: false  },
    '2' : { text: 'blah2', rel: {'child': ['4']}, data: {}, isCollapsed: false  },
    '3' : { text: 'blah3', rel: {'child': []}, data: {}, isCollapsed: false  },
    '4' : { text: 'blah4', rel: {'child': []}, data: {}, isCollapsed: false  },
    '5' : { text: 'blah5', rel: {'child': ['7','6']}, data: {}, isCollapsed: false  },
    '6' : { text: 'blah6', rel: {'child': []}, data: {}, isCollapsed: false  },
    '7' : { text: 'blah7', rel: {'child': []}, data: {}, isCollapsed: false  },
}

let environment1 = {
    homePath: [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}] as NodePath,
    activeNode: null
}
let environment2 = {
    homePath: [{rel:'root', id:'0'}, {rel:'child', id:'1'}] as NodePath,
    activeNode: null
}
let environment3 = {
    homePath: [{rel:'root', id:'0'}] as NodePath,
    activeNode: null
}

let state1: ChkFlowState = {
    environment: environment1,
    nodes: l1,
    defaultNodes: l1,
    defaultEnvironment: environment1,
    showDummies: false,
    nodeComponent: DefaultTreeNode,
    containerComponent: DefaultContainer,
    setStateCallback: ()=>{}, 
    execEnabled: false,
}
let state2: ChkFlowState = {
    environment: environment2,
    nodes: l2,
    defaultNodes: l2,
    defaultEnvironment: environment2,
    showDummies: false,
    nodeComponent: DefaultTreeNode,
    containerComponent: DefaultContainer,
    setStateCallback: ()=>{}, 
    execEnabled: false,
}
let state3: ChkFlowState = {
    environment: environment3,
    nodes: l2,
    defaultNodes: l2,
    defaultEnvironment: environment3,
    showDummies: false,
    nodeComponent: DefaultTreeNode,
    containerComponent: DefaultContainer,
    setStateCallback: ()=>{}, 
    execEnabled: false,
}

let state4: ChkFlowState = {
    environment: environment2,
    nodes: l3,
    defaultNodes: l1,
    defaultEnvironment: environment2,
    showDummies: false,
    nodeComponent: DefaultTreeNode,
    containerComponent: DefaultContainer,
    setStateCallback: ()=>{}, 
    execEnabled: false,
}

let state5: ChkFlowState = {
    environment: environment2,
    nodes: l1,
    defaultNodes: l1,
    defaultEnvironment: environment2,
    showDummies: false,
    nodeComponent: DefaultTreeNode,
    containerComponent: DefaultContainer,
    setStateCallback: ()=>{}, 
    execEnabled: false,
 
}

let state6: ChkFlowState = {
    environment: environment2,
    nodes: l4,
    defaultNodes: l1,
    defaultEnvironment: environment2,
    showDummies: false,
    nodeComponent: DefaultTreeNode,
    containerComponent: DefaultContainer,
    setStateCallback: ()=>{}, 
    execEnabled: false,
}




describe('properly runs node utilies & operations', ()=>{


    it('gets child paths from node & state', ()=>{
        getSubs(state1, [{rel:'root', id:'0'}]).map( (subs : NodePath[]) => {
            return expect(subs).toEqual([[{rel:'root', id:'0'}, {rel:'child', id:'1'}],[{rel:'root', id:'0'}, {rel:'child', id:'3'}]])
        }).unsafeCoerce()
        getSubs(state1, [{rel:'root', id:'0'}, {rel:'child', id:'1'}]).map( (subs : NodePath[]) => {
            return expect(subs).toEqual([[{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}], [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'2'}]])
        }).unsafeCoerce()
        let extracted = getSubs(state1, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'6'}]).extractNullable()
        expect(extracted).toBeNull();


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
        expect(getVisuallyNextNodePath(state1, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}]).extractNullable())
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'6'}])
        expect(getVisuallyNextNodePath(state1, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'6'}]).extractNullable())
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'7'}])
        expect(getVisuallyNextNodePath(state1, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'7'}]).extractNullable())
            .toEqual(null)

        expect(getVisuallyNextNodePath(state2, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}]).extractNullable())
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'6'}])
        expect(getVisuallyNextNodePath(state2, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'6'}]).extractNullable())
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'7'}])
        expect(getVisuallyNextNodePath(state2, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'7'}]).extractNullable())
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'2'}])
        
        expect(getVisuallyNextNodePath(state3, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'2'}, {rel:'child', id:'4'}]).extractNullable())
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'3'}])


    })

    it('gets previous node from path', () => {
        expect(getVisuallyPreviousNodePath(state1, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}]).extractNullable()).toEqual(null)
        expect(getVisuallyPreviousNodePath(state1, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'6'}]).extractNullable())
            .toEqual(null)
        expect(getVisuallyPreviousNodePath(state1, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'7'}]).extractNullable())
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'6'}])

            expect(getVisuallyPreviousNodePath(state2, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}]).extractNullable())
            .toEqual(null)
        expect(getVisuallyPreviousNodePath(state2, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'6'}]).extractNullable())
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'},])
        expect(getVisuallyPreviousNodePath(state2, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'7'}]).extractNullable())
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'6'}])

        //Get last child of (last child of last child of etc.) previous sibling
        expect(getVisuallyPreviousNodePath(state2, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'2'}]).extractNullable())
            .toEqual([{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'7'}])
        
    })

    it('moves node below parent in parent\'s list', ()=>{
        expect(moveUnderParent(state2, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}]).extractNullable())
            .toEqual(null)
        expect(
            moveUnderParent(state5, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}, {rel:'child', id:'6'}]).extractNullable()?.nodes
        ).toEqual(state4.nodes)


    })

    it('indents node under visually previous node if shared parent', ()=>{
        expect(moveUnderPreviousNode(state2, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}]).extractNullable())
            .toEqual(null)

        let y = moveUnderPreviousNode(state4, [{rel:'root', id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'6'}])
        console.log(y.extractNullable()?.nodes['1'])
        console.log(y.extractNullable()?.nodes['5'])
        expect(
            y.extractNullable()?.nodes
        ).toEqual(state6.nodes)


    })

})