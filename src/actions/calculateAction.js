import { CALCULATION_TYPES } from "./actionType.js";

export const addNewTable = (table) => {
    const type = CALCULATION_TYPES.ADD_NEW_TABLE;
    return { type, payload: table }
}

export const addNewFields = (table) => {
    const type = CALCULATION_TYPES.ADD_NEW_FIELDS;
    return { type, payload: table }
}

export const removeTable = (index) => {
    const type = CALCULATION_TYPES.REMOVE_TABLE_BY_INDEX;
    return { type, payload: index }
}

export const activeValues = (value) => {
    const type = CALCULATION_TYPES.ADD_ACTIVE_VALUES;
    return { type, payload: value }
}

export const increaseTabAccess = (index) => {
    const type = CALCULATION_TYPES.INCREASE_TAB_ACCESS;
    return { type, payload: index }
}

export const selectWareHouse = (name) => {
    const type = CALCULATION_TYPES.SELECT_WAREHOUSE;
    return { type, payload: name }
}