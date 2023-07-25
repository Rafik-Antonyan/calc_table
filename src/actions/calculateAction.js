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

export const selectWareHouse = (name, index) => {
    const type = CALCULATION_TYPES.SELECT_WAREHOUSE;
    return { type, payload: { name, index } }
}

export const clearActiveValues = () => {
    const type = CALCULATION_TYPES.CLEAR_ACTIVE_VALUES;
    return { type }
}

export const addNewWareHouse = () => {
    const type = CALCULATION_TYPES.ADD_NEW_WARE_HOUSE;
    return { type }
}

export const editRow = (info) => {
    const type = CALCULATION_TYPES.EDIT_ROW_DATA;
    return { type, payload: info }
}

export const setInitData = (data) => {
    const type = CALCULATION_TYPES.SET_INIT_DATA;
    return { type, payload: data }
}

export const saveEdit = (data) => {
    const type = CALCULATION_TYPES.SAVE_EDIT;
    return { type, payload: data }
}

export const setPeriod = (period) => {
    const type = CALCULATION_TYPES.ADD_PERIOD;
    return { type, payload: period }
}

export const setEditedData = (data) => {
    const type = CALCULATION_TYPES.SET_EDITED_DATA;
    return { type, payload: data }
}

export const setTableIndex = (index) => {
    const type = CALCULATION_TYPES.SET_TABLE_INDEX;
    return { type, payload: index }
}