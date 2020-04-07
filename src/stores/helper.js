import kebabCase from 'lodash/kebabCase'
import uniq from 'lodash/uniq';
import concat from 'lodash/concat';
import flatten from 'lodash/flatten';

const {parse, createBlock} = wp.blocks;
const {apiFetch} = wp;
const {dispatch, select, useDispatch} = wp.data;

const {getBlockTypes} = dispatch('core/blocks');
const {savePost} = dispatch('core/editor');
const {insertBlocks} = dispatch('core/block-editor');
const {createSuccessNotice, createErrorNotice} = dispatch('core/notices');
import {ModalManager} from '~starterblocks/modal-manager';

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

export const parseSectionData = (library) => {
    const librarySectionData = convertObjectToArray(library.sections);
    return {...categorizeData(librarySectionData), dependencyFilters: {none: true, ...library.dependencies.sections}};
}

export const parsePageData = (library) => {
    const libraryPageData = convertObjectToArray(library.pages);
    return {...categorizeData(libraryPageData), dependencyFilters: {none: true, ...library.dependencies.pages}};
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
        if (collection.homepageData) collection.pro = collection.homepageData.pro;

        let dependentPluginsList = [];
        if (collection.pages)
            dependentPluginsList = uniq(concat(flatten(collection.pages.map(page => library.pages[page].blocks ? Object.keys(library.pages[page].blocks) : []))));
        collection.blocks = dependentPluginsList.reduce((acc, plugin) => {
            return {...acc, [plugin]: ''};
        }, {});
        return collection;
    });
    return {...categorizeData(libraryCollectionData), dependencyFilters: {none: true, ...library.dependencies.pages}};
}

// one of important function
// get collection children data upon clicking on collection in collections tab
export const getCollectionChildrenData = (library, activeCollection) => {
    let childrenSections = library.collections[activeCollection];
    childrenSections = childrenSections.pages.map(child => {
        return {...library.pages[child], ID: child}
    });
    return childrenSections;
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


export const processImportHelper = (data, type, installedDependencies, errorCallback) => {
    let the_url = 'starterblocks/v1/template?type=' + type + '&id=' + data.ID;
    if ('source' in data) {
        the_url += '&source=' + data.source;
    }

    const options = {
        method: 'GET',
        path: the_url,
        headers: {'Content-Type': 'application/json', 'Registered-Blocks': installedBlocksTypes()}
    };
    const { switchEditorMode } = useDispatch( 'core/edit-post' );

    if (select('core/edit-post').getEditorMode() === 'text') {
        useDispatch('core/edit-post').switchEditorMode()
    }


    apiFetch(options).then(response => {
        if (response.success && response.data) {
            //import template
            let block_data = null;
            if ('template' in response.data) {
                block_data = parse(response.data.template);
            } else if ('attributes' in response.data) {
                if (!('innerBlocks' in response.data)) {
                    response.data.innerBlocks = [];
                }
                if (!('name' in response.data)) {
                    errorCallback('Template malformed, `name` for block not specified.');
                }
                // This kind of plugins are not ready to accept before reloading, thus, we save it into localStorage and just reload for now.
                if (installedDependencies === true) {
                    localStorage.setItem('block_data', JSON.stringify(response.data));
                    window.location.reload();
                } else {
                    block_data = createBlock(response.data.name, response.data.attributes, response.data.innerBlocks)
                }
            } else {
                errorCallback('Template error. Please try again.');
            }
            insertBlocks(block_data)
            createSuccessNotice('Template inserted', {type: 'snackbar'});
            if (installedDependencies === true)
                savePost()
                    .then(() => window.location.reload())
                    .catch(() => createErrorNotice('Error while saving the post', {type: 'snackbar'}));
            else {
                ModalManager.close();
                ModalManager.closeCustomizer();
            }
        } else {
            errorCallback(response.data.error);
        }
    }).catch(error => {
        errorCallback(error.code + ' : ' + error.message);
    });
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
        if (!blockData || blockData == null) return;
        blockData = createBlock(blockData.name, blockData.attributes, blockData.innerBlocks);
        insertBlocks(blockData);
        createSuccessNotice('Template inserted', {type: 'snackbar'});
        localStorage.setItem('block_data', null);
    } catch (error) {
        alert(error.code + ' : ' + error.message);
    }
}

export const installedBlocks = () => {
    let installed_blocks = select('core/blocks').getBlockTypes();
    return Object.keys(installed_blocks).map(key => {
        return installed_blocks[key]['name'];
    })
}
export const installedBlocksTypes = () => {
    let installed_blocks = select('core/blocks').getBlockTypes();

    let names = Object.keys(installed_blocks).map(key => {
        if (!installed_blocks[key]['name'].includes('core')) {
            return installed_blocks[key]['name'].split('/')[0];
        }
    })
    let unique = [...new Set(names)];
    var filtered = unique.filter(function (el) {
        return el;
    });

    return filtered
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
