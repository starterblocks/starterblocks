import kebabCase from 'lodash/kebabCase'
import uniq from 'lodash/uniq';
import concat from 'lodash/concat';
import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';

const {createBlock} = wp.blocks;
const {dispatch} = wp.data;
const {createSuccessNotice} = dispatch('core/notices');
const {insertBlocks} = dispatch('core/block-editor');

export const getCurrentState = (state) => state[state.activeItemType]
// Helper function not to be exported
const convertObjectToArray = (list) => {
    return Object.keys(list).map(key => {
        return {...list[key], ID: key};
    })
};
const getByKey = (arr, key) => (arr.find(x => Object.keys(x)[0] === key) || {})[key]


// parse categories and section data from section server data
export const categorizeData = (list) => {
    let categories = [];
    let data = {};

    list.forEach(item => {
        if (item.categories) {
            item.categories.map(catName => {
                let catSlug = kebabCase(catName);
                if (catSlug in data) {
                    data[catSlug].push(item)
                } else {
                    data[catSlug] = [];
                    data[catSlug].push(item)
                }
                let index = -1;
                categories.forEach((change, i) => {
                    if (catSlug == change.slug) {
                        index = i
                        categories[i].ids.push(item.id);
                    }
                });
                if (index === -1) {
                    categories.push({name: catName, slug: catSlug, ids: [item.id]})
                }
            })
        }
    });

    return {categories, data};
}

export const parseSectionData = (sections) => {
    const librarySectionData = convertObjectToArray(sections);
    return categorizeData(librarySectionData);
}

export const parsePageData = (pages) => {
    const libraryPageData = convertObjectToArray(pages);
    return categorizeData(libraryPageData);
}

export const parseCollectionData = (library) => {
    let libraryCollectionData = convertObjectToArray(library.collections);
    // filter out incomplete data
    libraryCollectionData = libraryCollectionData.filter(collection => collection.pages && collection.pages.length > 0);
    // After common handling, we need to populate homepage data
    libraryCollectionData = libraryCollectionData.map(collection => {
        if (collection.homepage && library.pages[collection.homepage]) collection.homepageData = library.pages[collection.homepage];
        else {
            collection.homepageData = library.pages[collection.pages[0]];
        }

        if (collection.pages) {
            collection.installDependenciesMissing = uniq(concat(flatten(collection.pages.map(page => library.pages[page].installDependenciesMissing || []))));
            collection.proDependenciesMissing = uniq(concat(flatten(collection.pages.map(page => library.pages[page].proDependenciesMissing || []))));
        }

        return collection;
    });
    return {...categorizeData(libraryCollectionData), dependencyFilters: {none: true, ...library.dependencies}};
}

// one of important function
// get collection children data upon clicking on collection in collections tab
// always homepage page first, sort alphabetically afterward
export const getCollectionChildrenData = (library, activeCollection) => {
    let activeCollectionData = library.collections[activeCollection];
    // sort page except homepage
    let childrenPages = activeCollectionData.pages
        .filter(page => page !== activeCollectionData.homepage)
        .map(child => {
            return {...library.pages[child], ID: child}
        });
    childrenPages = sortBy(childrenPages, 'name');
    // insert homepage at the beginning of the array
    if (activeCollectionData.homepage && library.pages[activeCollectionData.homepage]) {
        childrenPages.unshift(library.pages[activeCollectionData.homepage]);
    }
    return childrenPages;
}

// Check if the block is pro
export const isBlockPro = (pro, source) => {
    if (source && starterblocks.supported_plugins.hasOwnProperty(source))
        return (pro && !starterblocks.supported_plugins[source].is_pro);
    else
        return pro && starterblocks.mokama !== '1';
}

export const missingPro = (pro) => {
    return (starterblocks.mokama !== '1' && pro === true);
}

export const missingRequirement = (pro, requirements) => {
    if (!requirements) return missingPro(pro);
    else {
        const supported_plugins = starterblocks.supported_plugins;
        for (let i = 0; i < requirements.length; i++) {
            let requirement = requirements[i];
            if (!supported_plugins.hasOwnProperty(requirement.slug))
                return true; // Doesn't have the plugin installed
            else {
                let installedPlugin = supported_plugins[requirement.slug];
                if (Number(requirement.version) > Number(installedPlugin.version) ||
                    (requirement.pro === true && installedPlugin.pro === false))
                    return true;
            }
        }
        return proCheck;
    }
}


export const setWithExpiry = (key, value, ttl) => {
    const now = new Date();

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
        value: value,
        expiry: now.getTime() + ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
}

export const getWithExpiry = (key, defaultValue = null) => {
    const itemStr = localStorage.getItem(key);

    // if the item doesn't exist, return null
    if (!itemStr) {
        return defaultValue;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
        // If the item is expired, delete the item from storage
        // and return null
        localStorage.removeItem(key);
        return defaultValue;
    }
    return item.value;
}


export const handlingLocalStorageData = () => {
    try {
        let blockData = localStorage.getItem('block_data');
        if (!blockData || blockData == null) return;
        blockData = JSON.parse(blockData);
        if (!blockData || blockData == null || blockData.length < 1) return;

        blockData = blockData.filter(block => (block.name && block.attributes && block.innerBlocks) )
            .map(block => {
                if (block.name && block.attributes && block.innerBlocks) return createBlock(block.name, block.attributes, block.innerBlocks);
            });
        if (blockData.length > 0) {
            insertBlocks(blockData);
            createSuccessNotice('Template inserted', {type: 'snackbar'});
        }
        localStorage.setItem('block_data', null);
    } catch (error) {
        alert(error.code + ' : ' + error.message);
    }
}


export const columnMap = {
    'large': 2,
    'medium': 3,
    'small': 4
};

export const pageSizeMap = {
    'large': 20,
    'medium': 30,
    'small': 40
};

export const getOnlySelectedDependencyFilters = (dependencyFilters) => {
    return Object.keys(dependencyFilters).filter(key => dependencyFilters[key]);
}
