
import { getVisuallyNextNodePath, getVisuallyPreviousNodePath, buildSubtree, buildChildSubtree, delArrayPrefix  } from '../chk/NodeUtils'
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
describe('properly runs node utilies & operations', ()=>{
    it('builds subtree from nodes & node', ()=>{
        let o1 =  buildChildSubtree(l1, ['5'])
        expect(buildChildSubtree(l1, ['5'])).toEqual({5:{6:{},7:{}}})
        expect(buildChildSubtree(l1, ['6'])).toEqual({6:{}})
        expect(buildChildSubtree(l1, ['1'])).toEqual({1:{5:{6:{},7:{}},2:{4:{}}}})
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
        expect(getVisuallyNextNodePath(props, ["0","1","5"])).toEqual(["0","1","5","6"])
        expect(getVisuallyNextNodePath(props, ["0","1","5","6"])).toEqual(["0","1","5","7"])
        expect(getVisuallyNextNodePath(props, ["0","1","5","7"])).toEqual(null)
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
        expect(getVisuallyNextNodePath(props, ["0","1","5"])).toEqual(["0","1","5","6"])
        expect(getVisuallyNextNodePath(props, ["0","1","5","6"])).toEqual(["0","1","5","7"])
        expect(getVisuallyNextNodePath(props, ["0","1","5","7"])).toEqual(["0","1","2"])
        
    })

    it('gets previous node from path', () => {
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
        expect(getVisuallyPreviousNodePath(props, ["0","1","5"])).toEqual(null)
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