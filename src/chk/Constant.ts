
import * as Types from './types' 


const dummyNodes = {
    '0' : { text: '[root] (you should not be seeing this)', rel: {'child': ['1','3']}, data: {}, isCollapsed: false },
    '1' : { text: 'chores', rel: {'child': ['5', '2']}, data: {}, isCollapsed: false  },
    '2' : { text: 'clean', rel: {'child': ['4']}, data: {}, isCollapsed: false  },
    '3' : { text: 'study', rel: {'child': []}, data: {}, isCollapsed: false  },
    '4' : { text: 'bathroom', rel: {'child': []}, data: {},  isCollapsed: false  },
    '5' : { text: 'groceries', rel: {'child': ['6','7']}, data: {}, isCollapsed: false  },
    '6' : { text: 'milk', rel: {'child': []}, data: {}, isCollapsed: false  },
    '7' : { text: 'eggs', rel: {'child': []}, data: {}, isCollapsed: false  },
    'child' : { text: '[child] (you should not be seeing this)', rel: {'child': ['1','3']}, data: {}, isCollapsed: false },
    // 'rel' : { text: '[rel] (you should not be seeing this)', rel: {'child': ['1','3']}, data: {}, isCollapsed: false },
}
const dummyEnvironment = {
    homePath: [{rel:'root',id:'0'}, {rel:'child', id:'1'}, {rel:'child', id:'5'}] as Types.NodePath,
    activeNode: null,
}

const defaultNodes = {
    '0' : { text: '[root] (you should not be seeing this)', rel: {'child': ['1']}, data: {}, isCollapsed: false },
    '1' : { text: '', rel: {'child': []}, data: {}, isCollapsed: false  },
    'child' : { text: '[child] (you should not be seeing this)', rel: {}, data: {}, isCollapsed: false },
}
const defaultEnvironment = {
    homePath: [{id:'0', rel:'root'}] as Types.NodePath,
    activeNode: null,
}
export {
    dummyNodes,
    dummyEnvironment,
    defaultNodes,
    defaultEnvironment
}