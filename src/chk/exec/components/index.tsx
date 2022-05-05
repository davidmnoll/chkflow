// import {
//     Autocomplete 
// } from '@material-ui/lab';
// import {
//    TextField 
// } from '@material-ui/core';
// import {
//     UseAutocompleteProps
// } from '@material-ui/lab/useAutocomplete';
import { propSatisfies } from 'ramda'
import type * as Types from '../types' 


// const RelInput = function(props: Types.RelInputProps) {

//     const autocompleteProps: UseAutocompleteProps<Types.NodeId, false, true, false> = {
//         freeSolo: false,
//         multiple: false,
//         disableClearable: true,
//         options: props.relKeys
//     }


//     return (<Autocomplete 
//         {...autocompleteProps}
//         style={{ width: '130px', height: '20px', margin: '0' }}
//         value={props.relId}
//         // onChange={(event, value) => {setRelValue(value || '')}}
//         onChange={props.onChange}
//         renderInput={(params) => (<TextField
//                 {...params}
//                 size='small'
//                 style={{ margin: '0' }}
//                 margin="normal"
//                 variant="outlined"
//                 InputProps={{ ...params.InputProps, type: 'search' }}
//             />)}
//     />)
// }

const NodeCheckbox = function(props: Types.NodeCheckboxProps) {
    
    const data = props.nodeData
    const relData = data[props.relId]
    const status = relData 

    const onChange: React.ChangeEventHandler<HTMLInputElement> = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.checked
        const newData = props.nodeData ? {
            ...props.nodeData,
            [props.relId]: value
        } : {
            [props.relId]: value
        }
        console.log('onChange', value, event) 
        console.log('nodedata', newData, props.nodeData)
        props.updateNodeData(newData)
    }


    return (<div><label htmlFor="relinput">{props.relLabel}</label><input type="checkbox" checked={!!status} name="relinput" onChange={onChange} /></div>)
}

export {
//     RelInput
    NodeCheckbox
}