export const actions = {
    setLibrary( library ) {
        return {
            type: "SET_LIBRARY",
            library
        };
    },
    fetchLibraryFromAPI( path ) {
        return {
            type: "FETCH_LIBRARY_FROM_API",
            path,
        };
    },
    setActiveItemType( activeItemType ) {
        return {
            type: "SET_ACTIVE_ITEM_TYPE",
            activeItemType
        }
    },
    setActiveCategory( activeCategory ) {
        return {
            type: "SET_ACTIVE_CATEGORY",
            activeCategory
        }
    },
    setActiveCollection( activeCollection ) {
        return {
            type: "SET_ACTIVE_COLLECTION",
            activeCollection
        }
    },
    setActivePriceFilter( activePriceFilter ) {
        return {
            type: "SET_ACTIVE_PRICE_FILTER",
            activePriceFilter
        }
    },
    setSearchContext( searchContext ) {
        return {
            type: "SET_SEARCH_CONTEXT",
            searchContext
        }
    },
    setLoading( loading ) {
        return {
            type: "SET_LOADING",
            loading
        }
    },
    setSortBy( sortBy ) {
        return {
            type: "SET_SORT_BY",
            sortBy
        }
    },
    appendErrorMessage( errorMessage ) {
        return {
            type: "APPEND_ERROR_MESSAGE",
            errorMessage: errorMessage || "Unknown Error"
        }
    },
    discardAllErrorMessages() {
        return {
            type: "DISCARD_ALL_ERROR_MESSAGES"
        }
    }
};
