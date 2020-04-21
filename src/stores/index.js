const {apiFetch} = wp;
const {registerStore} = wp.data;

import {initialState, reducer} from './reducer';
import {actions} from './actions';
import cloneDeep from 'lodash/cloneDeep';
import sortBy from 'lodash/sortBy';
import countBy from 'lodash/countBy';
import map from 'lodash/map';
import {applyCategoryFilter, applySearchFilter, applyHashFilter, applyPriceFilter, applyDependencyFilters} from './filters'
import {getCurrentState, getCollectionChildrenData} from './helper';
import {isTemplatePremium} from './dependencyHelper'
import {installedBlocksTypes} from './actionHelper';

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
    // console.log("Dependency Filters", getCurrentState(state).dependencyFilters);
    return getCurrentState(state).dependencyFilters;
};
const getActiveCategory = (state) => {
    return state[state.activeItemType].activeCategory;
};

const getCurrentPage = (state) => {
    return state[state.activeItemType].currentPage;
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
        getCurrentPage,
        getActiveCategory,
        // get categories from currentState, sortBy alphabetically, with the count of pageData within the current category
        getCategoryData(state) {
            let categories = [];
            let pageData = getOriginalPageData(state);
            if (pageData && Object.keys(pageData).length > 0) {
                pageData = applySearchFilter(pageData, getSearchContext(state));
                pageData = applyDependencyFilters(pageData, getDependencyFilters(state));
                pageData = applyPriceFilter(pageData, getActivePriceFilter(state), getDependencyFilters(state));
            }
            if (state.collection.activeCollection === null || state.activeItemType !== 'collection') {
                categories = cloneDeep(getCurrentState(state).categories);
                categories = categories.map(category => {
                    const filteredData = map(pageData[category.slug], 'id');
                    return {...category, filteredData};
                });
            }

            categories = sortBy(categories, 'name');
            return categories;
        },
        // get relevant page data, apply category, price, search, dependent filters
        getPageData(state) {
            let pageData = getOriginalPageData(state);
            let hashFilteredData = [];
            const searchKeyword = getSearchContext(state);
            if (state.activeItemType !== 'collection' && searchKeyword.length > 5) hashFilteredData = applyHashFilter(pageData, searchKeyword);
            if (pageData && Object.keys(pageData).length > 0) {
                pageData = applySearchFilter(pageData, searchKeyword);
                pageData = applyDependencyFilters(pageData, getDependencyFilters(state));
                pageData = applyPriceFilter(pageData, getActivePriceFilter(state), getDependencyFilters(state));
                if (state.collection.activeCollection === null || state.activeItemType !== 'collection') {
                    pageData = applyCategoryFilter(pageData, getActiveCategory(state));
                    pageData = sortBy(pageData, getCurrentState(state).sortBy);
                }
                return [...hashFilteredData, ...pageData];
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
                staticsData = countBy(pageData, (item) => isTemplatePremium(item, getDependencyFilters(state)));
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
        getActiveCollectionData(state) {
            if (state.library && state.library.collections && state.collection)
                return state.library.collections[state.collection.activeCollection];
            return null;
        },
        getSaved(state) {
            return state.saved;
        },
        getErrorMessages(state) {
            return state.errorMessages;
        },
        getInstalledDependencies(state) {
            return state.installedDependencies;
        },
        getTourOpen(state) {
            return state.tour.isOpen;
        },
        getTourActiveButtonGroup(state) {
            return state.tour.activeButtonGroup;
        },
        getTourPreviewVisible(state) {
            return state.tour.isPreviewVisible;
        },
        getImportingTemplate(state) {
            return state.importingTemplate;
        },
        getPlugins(state) {
            return state.plugins;
        }
    },

    controls: {
        FETCH_LIBRARY_FROM_API(action) {
            return apiFetch({path: action.path, method: 'POST', data: {registered_blocks: installedBlocksTypes()}});
        },
        FETCH_SAVED_FROM_API(action) {
            return apiFetch({path: action.path, method: 'POST', data: {registered_blocks: installedBlocksTypes()}});
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
