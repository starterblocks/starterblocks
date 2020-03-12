const {apiFetch} = wp;
const {registerStore} = wp.data;

import {initialState, reducer} from './reducer';
import {actions} from './actions';
import cloneDeep from 'lodash/cloneDeep';
import sortBy from 'lodash/sortBy';
import countBy from 'lodash/countBy';
import {applyCategoryFilter, applySearchFilter, applyPriceFilter, applyDependencyFilters} from './filters'
import {getCurrentState, getCollectionChildrenData} from './helper';

const getOriginalPageData = (state) => {
    if (state.activeItemType === 'collection' && state.collection.activeCollection !== null)
        return getCollectionChildrenData(state.library, state.collection.activeCollection);
    else
        return getCurrentState(state).data;
    return {};
};

const getActivePriceFilter = (state) => {
    return getCurrentState(state).priceFilter;
};
const getSearchContext = (state) => {
    return (state.activeItemType !== 'saved') ? getCurrentState(state).searchContext : null;
};
const getDependencyFilters = (state) => {
    return getCurrentState(state).dependencyFilters;
};
const getActiveCategory = (state) => {
    return state[state.activeItemType].activeCategory;
};
const getActiveItemType = (state) => {
    return state.activeItemType;
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

        getActivePriceFilter,
        getSearchContext,
        getDependencyFilters,
        getActiveItemType,
        getActiveCategory,
        // get categories from currentState, sortBy alphabetically
        getCategoryData(state) {
			let categories = [];
			let pageData = getOriginalPageData(state);
            if (pageData && Object.keys(pageData).length > 0) {
                pageData = applySearchFilter(pageData, getSearchContext(state));
                pageData = applyPriceFilter(pageData, getActivePriceFilter(state));
                pageData = applyDependencyFilters(pageData, getDependencyFilters(state));
			}
            if (state.collection.activeCollection === null || state.activeItemType !== 'collection') {
				categories = cloneDeep(getCurrentState(state).categories);
				categories = categories.map(category => {
					const filteredCount = pageData[category.slug] ? pageData[category.slug].length : 0;
					return {...category, filteredCount};
				});
            }

            categories = sortBy(categories, 'name');
            return categories;
        },
        // get relevant page data, apply category, price, search filters
        getPageData(state) {
			let pageData = getOriginalPageData(state);
            if (pageData && Object.keys(pageData).length > 0) {
                pageData = applySearchFilter(pageData, getSearchContext(state));
                pageData = applyPriceFilter(pageData, getActivePriceFilter(state));
                pageData = applyDependencyFilters(pageData, getDependencyFilters(state));
				if (state.collection.activeCollection === null || state.activeItemType !== 'collection') pageData = applyCategoryFilter(pageData, getActiveCategory(state));
				pageData = sortBy(pageData, getCurrentState(state).sortBy);
				return pageData;
            }
            return null;
        },
        getStatistics(state) {
            let pageData = getOriginalPageData(state);
			let staticsData = {true: 0, false: 0};
            if (pageData && Object.keys(pageData).length > 0) {
                pageData = applySearchFilter(pageData, getSearchContext(state));
                pageData = applyDependencyFilters(pageData, getDependencyFilters(state));
                if (state.collection.activeCollection === null || state.activeItemType !== 'collection') pageData = applyCategoryFilter(pageData, getActiveCategory(state));
                staticsData = countBy(pageData, 'pro');
            }
            return staticsData;
        },
        getLoading(state) {
            return state.loading;
        },
        getColumns(state) {
            return state.columns;
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
