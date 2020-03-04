import {parseSectionData, parsePageData, parseCollectionData, parsePageSectionData} from "./helper";

export const initialState = {
    loading: false,
    activeItemType: 'section',
    library: [],
    errorMessages: [],
    section: {
        categories: [],
        data: {},
        priceFilter: '',
        activeCategory: null,
        searchContext: '',
        sortBy: 'name'
    },
    page: {
        categories: [],
        data: {},
        priceFilter: '',
        activeCategory: null,
        searchContext: '',
        sortBy: 'name'
    },
    collection: {
        categories: [],
        data: {},
        priceFilter: '',
        activeCategory: null,
        searchContext: '',
        activeCollection: null,
        sortBy: 'name'
    }
};

export const reducer = ( state = initialState, action ) => {

    switch ( action.type ) {
        case 'SET_LIBRARY':
            let parsedSection = parseSectionData(action.library);
            let parsedPage = parsePageData(action.library);
            let parsedCollection = parseCollectionData(action.library);
            return {
                ...state,
                library: action.library,
                section: {
                    ...state.section,
                    ...parsedSection
                },
                page: {
                    ...state.page,
                    ...parsedPage
                },
                collection: {
                    ...state.collection,
                    ...parsedCollection
                }
            };
        case 'SET_ACTIVE_CATEGORY':
            return {
                ...state,
                [state.activeItemType]: {
                    ...state[state.activeItemType],
                    activeCategory: action.activeCategory
                }
            };
        case 'SET_SEARCH_CONTEXT':
            return {
                ...state,
                [state.activeItemType]: {
                    ...state[state.activeItemType],
                    searchContext: action.searchContext
                }
            };
        case 'SET_ACTIVE_PRICE_FILTER':
            return {
                ...state,
                [state.activeItemType]: {
                    ...state[state.activeItemType],
                    priceFilter: action.activePriceFilter
                }
            };
        case 'SET_ACTIVE_ITEM_TYPE':
            return {
                ...state,
                activeItemType: action.activeItemType
            };
        case 'SET_SORT_BY':
            return {
                ...state,
                [state.activeItemType]: {
                    ...state[state.activeItemType],
                    sortBy: action.sortBy
                }
            };
        case 'SET_ACTIVE_COLLECTION':
            return {
                ...state,
                collection: {
                    ...state.collection,
                    activeCollection: action.activeCollection
                }
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.loading
            }
        case 'APPEND_ERROR_MESSAGE':
            return {
                ...state,
                errorMessages: state.errorMessages.concat([action.errorMessage])
            }
        case 'DISCARD_ALL_ERROR_MESSAGES':
            return {
                ...state,
                errorMessages: []
            }
    }

    return state;
};