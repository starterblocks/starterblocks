import kebabCase from 'lodash/kebabCase'
export const getCurrentState = (state) => state[state.activeItemType]
const {parse} = wp.blocks;
const {apiFetch} = wp;
const {dispatch} = wp.data;
const {savePost} = dispatch('core/editor');
const {insertBlocks} = dispatch('core/block-editor');
// Helper function not to be exported
const convertObjectToArray = (list) => {
    return Object.keys(list).map(key => {
        return {...list[key], ID: key};
    })
};

// parse categories and section data from section server data
export const categorizeData = (list) => {
    let categories = [];
    let data = {};

    list.forEach( item => {
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
                        categories[i].count = categories[i].count + 1
                    }
                });
                if (index === -1) {
                    categories.push({ name: catName, slug: catSlug, count: 1 })
                }
            })
        }
    });

    return {categories, data};
}

export const parseSectionData = (library) => {
    const librarySectionData = convertObjectToArray(library.sections);
    return categorizeData(librarySectionData);
}

export const parsePageData = (library) => {
    const libraryPageData = convertObjectToArray(library.pages);
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
        if (collection.homepageData) collection.pro = collection.homepageData.pro;
        return collection;
    })
    return categorizeData(libraryCollectionData);
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


export const processImportHelper = (data, type, errorCallback) => {
	let the_url = 'starterblocks/v1/template?type=' + type + '&id=' + data.ID;
	if (data.source_id) {
		the_url += '&sid=' + data.source_id + '&source=' + data.source;
	}
	the_url += '&p=' + JSON.stringify(starterblocks.supported_plugins);
	const options = {
		method: 'GET',
		path: the_url,
		headers: {'Content-Type': 'application/json'}
	};
	apiFetch(options).then(response => {
		if (response.success && response.data.template) {
			//import template
			let pageData = parse(response.data.template);
			insertBlocks(pageData);
			setTimeout(() => {
				savePost().then(() => {
					window.location.reload();
				});
			}, 5000);
		} else {
			errorCallback(response.data.error);
		}
	}).catch(error => {
		errorCallback(error.code + ' : ' + error.message);
	});
}
