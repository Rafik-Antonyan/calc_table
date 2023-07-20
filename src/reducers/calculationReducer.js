import { CALCULATION_TYPES } from "actions/actionType.js";

const initialState = {
    fields: [],
    calculationTables: [],
    active: {},
    tabAccess: 0,
    selectedWareHouse: { name: "", price: "" }
};

const calculationReducer = (state = initialState, action) => {
    switch (action.type) {
        case CALCULATION_TYPES.ADD_NEW_TABLE:
            return {
                ...state,
                calculationTables: [...state.calculationTables, action.payload]
            }
        case CALCULATION_TYPES.ADD_NEW_FIELDS:
            return {
                ...state,
                fields: [...state.fields, action.payload]
            }
        case CALCULATION_TYPES.REMOVE_TABLE_BY_INDEX:
            return {
                ...state,
                fields: state.fields.filter((_, index) => index !== action.payload),
                calculationTables: state.calculationTables.filter((_, index) => index !== action.payload)
            }
        case CALCULATION_TYPES.ADD_ACTIVE_VALUES:
            return {
                ...state,
                active: { ...state.active, ...action.payload }
            }
        case CALCULATION_TYPES.INCREASE_TAB_ACCESS:
            return {
                ...state,
                tabAccess: action.payload
            }
        case CALCULATION_TYPES.SELECT_WAREHOUSE:
            return {
                ...state,
                selectedWareHouse: action.payload
            }
        default:
            return state;
    }
}

export default calculationReducer;