const {parse, createBlock} = wp.blocks;
const {apiFetch} = wp;
const {dispatch, select, useDispatch} = wp.data;
const {getBlockTypes} = dispatch('core/blocks');
const {savePost} = dispatch('core/editor');
const {insertBlocks} = dispatch('core/block-editor');
const {createSuccessNotice, createErrorNotice} = dispatch('core/notices');
import {ModalManager} from '~starterblocks/modal-manager';
import PreviewModal from '../modal-preview';


export const processImportHelper = (type, errorCallback) => {
    const data = select('starterblocks/sectionslist').getImportingTemplate();
    const installedDependencies = select('starterblocks/sectionslist').getInstalledDependencies();
    const { setImportingTemplate } = useDispatch('starterblocks/sectionslist');
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
            setImportingTemplate(null);
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

// reload library button handler
export const reloadLibrary = () => {
    const { setLoading, setLibrary } = useDispatch('starterblocks/sectionslist');
    setLoading(true);
    apiFetch({
        path: 'starterblocks/v1/library?no_cache=1',
        method: 'POST',
        data: {
            'registered_blocks': installedBlocksTypes(),
        }
    }).then((newLibrary) => {
        setLoading(false);
        setLibrary(newLibrary.data);
    }).catch((error) => {
        registerError(error);
    });
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

export const openSitePreviewModal = (index, pageData) => {
    ModalManager.openCustomizer(
        <PreviewModal startIndex={index} currentPageData={pageData}/>
    )
}
