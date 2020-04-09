import {parseSectionData, parsePageData, parseCollectionData, parsePageSectionData} from './helper';
import {setWithExpiry, getWithExpiry} from './helper';
const EXIPRY_TIME = 5 * 24 * 3600 * 1000;
export const initialState = {
    loading: false,
    activeItemType: 'section',
    library: null,
    columns: getWithExpiry('column', ''),
    errorMessages: [],
    section: {
        categories: [],
        data: {},
        priceFilter: getWithExpiry('section', ''),
        activeCategory: '',
        dependencyFilters: {},
        searchContext: '',
        sortBy: 'name',
        currentPage: 0
    },
    page: {
        categories: [],
        data: {},
        priceFilter: getWithExpiry('page', ''),
        activeCategory: '',
        dependencyFilters: {},
        searchContext: '',
        sortBy: 'name',
        currentPage: 0
    },
    collection: {
        categories: [],
        data: {},
        priceFilter: getWithExpiry('collection', ''),
        activeCategory: '',
        dependencyFilters: {},
        searchContext: '',
        activeCollection: null,
        sortBy: 'name',
        currentPage: 0
    },
    installedDependencies: false, // used when deciding should or not reload page after importing the template
    tour: {
        isOpen: false,
        activeButtonGroup: null,
        isPreviewVisible: false
    },
    plugins: {},
    importingTemplate: null
};

export const reducer = ( state = initialState, action ) => {

    switch ( action.type ) {
        case 'SET_LIBRARY':

            const dependencies = Object.keys(action.library.dependencies).reduce((acc, cur) => {
                return {...acc, [cur]: true}
            }, {none: true});

            let parsedSection = parseSectionData(action.library.sections);
            let parsedPage = parsePageData(action.library.pages);
			let parsedCollection = parseCollectionData(action.library);
            return {
                ...state,
                loading: false,
                library: action.library,
                section: {
                    ...state.section,
                    ...parsedSection,
                    dependencyFilters: dependencies
                },
                page: {
                    ...state.page,
                    ...parsedPage,
                    dependencyFilters: dependencies
                },
                collection: {
                    ...state.collection,
                    ...parsedCollection,
                    dependencyFilters: dependencies
                },
                plugins: action.library.plugins
            };
        case 'SET_ACTIVE_CATEGORY':
            return {
                ...state,
                [state.activeItemType]: {
                    ...state[state.activeItemType],
                    currentPage: 0,
                    activeCategory: action.activeCategory
                }
            };
        case 'SET_SEARCH_CONTEXT':
            return {
                ...state,
                [state.activeItemType]: {
                    ...state[state.activeItemType],
                    currentPage: 0,
                    searchContext: action.searchContext
                }
            };
        case 'SET_ACTIVE_PRICE_FILTER':
            setWithExpiry(state.activeItemType, action.activePriceFilter, EXIPRY_TIME);
            return {
                ...state,
                [state.activeItemType]: {
                    ...state[state.activeItemType],
                    currentPage: 0,
                    priceFilter: action.activePriceFilter
                }
            };
        case 'SET_ACTIVE_ITEM_TYPE':
            return {
                ...state,
                activeItemType: action.activeItemType
            };
        case 'SET_DEPENDENCY_FILTERS':
            return {
                ...state,
                [state.activeItemType]: {
                    ...state[state.activeItemType],
                    currentPage: 0,
                    dependencyFilters: action.dependencyFilters
                }
            }
        case 'SET_SORT_BY':
            return {
                ...state,
                [state.activeItemType]: {
                    ...state[state.activeItemType],
                    currentPage: 0,
                    sortBy: action.sortBy
                }
            };
        case 'SET_CURRENT_PAGE':
            return {
                ...state,
                [state.activeItemType]: {
                    ...state[state.activeItemType],
                    currentPage: action.currentPage
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
        case 'SET_COLUMNS':
            setWithExpiry('column', action.columns, EXIPRY_TIME);
            return {
                ...state,
                columns: action.columns
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
        case 'SET_INSTALLED_DEPENDENCIES':
            return {
                ...state,
                installedDependencies: action.installedDependencies
            }
        case 'SET_TOUR_OPEN':
            return {
                ...state,
                tour:  {
                    ...state.tour,
                    isOpen: action.isTourOpen
                }
            };
        case 'SET_TOUR_ACTIVE_BUTTON_GROUP':
            return {
                ...state,
                tour:  {
                    ...state.tour,
                    activeButtonGroup: action.data
                }
            };
        case 'SET_PREVIEW_VISIBLE':
            return {
                ...state,
                tour:  {
                    ...state.tour,
                    isPreviewVisible: action.isVisible
                }
            };
        case 'SET_IMPORTING_TEMPLATE':
            return {
                ...state,
                importingTemplate: action.importingTemplate
            }
    }

    return state;
};
