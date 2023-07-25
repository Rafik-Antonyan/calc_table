import { CALCULATION_TYPES } from "actions/actionType.js";

const initialState = {
    fields: [],
    calculationTables: [],
    active: {},
    tabAccess: 0,
    selectedWareHouse: [{ name: "", price: "" }],
    initData: [],
    editValues: [],
    periods: [],
    editedTableIndex: null
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
                selectedWareHouse:
                    state.selectedWareHouse.map((wareHouse, ind) => {
                        if (ind === action.payload.index) {
                            return action.payload.name
                        }
                        return wareHouse
                    })
            }
        case CALCULATION_TYPES.CLEAR_ACTIVE_VALUES:
            return {
                ...state,
                active: {},
                tabAccess: 0
            }
        case CALCULATION_TYPES.ADD_NEW_WARE_HOUSE:
            return {
                ...state,
                selectedWareHouse: [...state.selectedWareHouse, { name: "", price: "" }]
            }
        case CALCULATION_TYPES.SET_INIT_DATA:
            return {
                ...state,
                initData: [...state.initData, action.payload]
            }
        case CALCULATION_TYPES.EDIT_ROW_DATA:
            return {
                ...state,
                editValues: action.payload
            }
        case CALCULATION_TYPES.SAVE_EDIT:
            return {
                ...state,
                editValues: [],
                initData: action.payload
            }
        case CALCULATION_TYPES.ADD_PERIOD:
            return {
                ...state,
                periods: [...state.periods, action.payload],
            }
        case CALCULATION_TYPES.SET_EDITED_DATA:
            return {
                ...state,
                calculationTables: [...state.calculationTables.map((table, index) => {
                    if (index === state.editedTableIndex) {
                        table = [...action.payload]
                    }
                    return table
                })],
            }
        case CALCULATION_TYPES.SET_TABLE_INDEX:
            return {
                ...state,
                editedTableIndex: action.payload,
            }
        default:
            return state;
    }
}

export default calculationReducer;