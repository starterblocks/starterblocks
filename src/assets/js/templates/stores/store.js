const {apiFetch} = wp;
const {registerStore} = wp.data;

import {initialState, reducer} from "./reducer";
import {actions} from "./actions";
import cloneDeep from "lodash/cloneDeep";
import sortBy from "lodash/sortBy";
import countBy from "lodash/countBy";
import {applyCategoryFilter, applySearchFilter, applyPriceFilter} from "./filters"
import {getCurrentState, getCollectionChildrenData} from "./helper";

const getOriginalPageData = (state) => {
    if (state.activeItemType === 'collection' && state.collection.activeCollection !== null)
        return getCollectionChildrenData(state.library, state.collection.activeCollection);
    else
        return getCurrentState(state).data;
    return {};
};


const store = registerStore('starterblocks/sectionslist', {

    reducer,
    actions,

    selectors: {
        fetchLibraryFromAPI(state) {
            return state.library;
        },
        receive(state) {
            return state.sections;
        },
        getActiveCategory(state) {
            return state[state.activeItemType].activeCategory;
        },
        getActiveItemType(state) {
            return state.activeItemType;
        },
        // get categories from currentState, sortBy alphabetically
        getCategoryData(state) {
            let categories = [];
            if (state.collection.activeCollection === null || state.activeItemType !== 'collection')
                categories = cloneDeep(getCurrentState(state).categories);
            // categories = applyPriceCategoryFilter(categories);
            categories = sortBy(categories, 'name');
            return categories;
        },
        // get relevant page data, apply category, price, search filters
        getPageData(state) {
            let pageData = getOriginalPageData(state);
            if (pageData) {
                if (state.collection.activeCollection === null || state.activeItemType !== 'collection') pageData = applyCategoryFilter(pageData, getCurrentState(state).activeCategory);
                pageData = applySearchFilter(pageData, getCurrentState(state).searchContext);
                pageData = applyPriceFilter(pageData, getCurrentState(state).priceFilter);
                pageData = sortBy(pageData, getCurrentState(state).sortBy);
            }
            return pageData;
        },
        getStatistics(state) {
            let pageData = getOriginalPageData(state);
            let staticsData = {true: 0, false: 0};
            if (pageData) {
                if (state.collection.activeCollection === null || state.activeItemType !== 'collection') pageData = applyCategoryFilter(pageData, getCurrentState(state).activeCategory);
                pageData = applySearchFilter(pageData, getCurrentState(state).searchContext);
                staticsData = countBy(pageData, 'pro');
            }
            return staticsData;
        },
        getActivePriceFilter(state) {
            return getCurrentState(state).priceFilter;
        },
        getSearchContext(state) {
            if (state.activeItemType !== 'saved')
                return getCurrentState(state).searchContext;
        },
        getLoading(state) {
            return state.loading;
        },
        getSortBy(state) {
            return getCurrentState(state).sortBy;
        },
        getActiveCollection(state) {
            return state.collection.activeCollection;
        },
        getSaved(state) {
            return state.saved;
        },
        getErrorMessages(state) {
            return state.errorMessages;
        }
    },

    controls: {
        FETCH_LIBRARY_FROM_API(action) {
            return apiFetch({path: action.path});
        },
        FETCH_SAVED_FROM_API(action) {
            return apiFetch({path: action.path});
        }
    },

    resolvers: {
        * fetchLibraryFromAPI(state) {
            try {
                const receiveSectionResult = yield actions.fetchLibraryFromAPI('starterblocks/v1/library');
                return actions.setLibrary(receiveSectionResult.data);
            } catch (error) {
                return actions.appendErrorMessage(error.code + ' ' + error.message)
            }
        }
    },

    initialState
});