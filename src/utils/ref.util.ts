import {v4} from "uuid"

export const generateReference =()=>{
    const uuid =v4()
    const timestamp = Date.now()
    return `${uuid}-${timestamp}`
}