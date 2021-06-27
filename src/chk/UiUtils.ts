import { Types } from "./ChkFlow"
import * as R from 'ramda'



function  placeCursorFromBeginning(element: HTMLDivElement, offset: number = 0): void {
    element.focus()
    let range = document.createRange()
    let selection = window.getSelection()
    range.setStart(element.childNodes[0], offset )
    range.collapse(false)
    if (selection){
        selection.removeAllRanges()
        selection.addRange(range)
    }
}

function placeCursorFromEnd(element: HTMLDivElement, offset: number = 0): void {
    // https://stackoverflow.com/questions/6249095/how-to-set-caretcursor-position-in-contenteditable-element-div
    element.focus()
    let range = document.createRange()
    let selection = window.getSelection()
    range.setStart(element.childNodes[0], element.innerText.length - offset)
    range.collapse(false)
    if (selection){
        selection.removeAllRanges()
        selection.addRange(range)
    }
}

function getNodeTailFromPath(path: Types.NodeId[]): HTMLDivElement{
    return getNodeFromPath(path).querySelector('.node-tail') as HTMLDivElement
}
function getNodeFromPath(path: Types.NodeId[]): HTMLDivElement{
    let id = R.last(path) as string;
    return document.getElementById(id) as HTMLDivElement;
}

export {
    placeCursorFromBeginning,
    placeCursorFromEnd,
    getNodeTailFromPath
}