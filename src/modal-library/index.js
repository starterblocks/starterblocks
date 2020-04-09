const {apiFetch} = wp;
const {parse} = wp.blocks;
const {compose} = wp.compose;
const {withDispatch, withSelect, select} = wp.data;
const {Fragment, useState, useEffect} = wp.element;
const {Spinner} = wp.components;

import '../stores';

import {Modal, ModalManager} from '../modal-manager'
import TabHeader from '../components/tab-header';
import WithSidebarLayout from './layout-with-sidebar';
import CollectionView from './view-collection';
import SavedView from './view-saved';
import PreviewModal from '../modal-preview';
import ImportWizard from '../modal-import-wizard';
import ErrorNotice from '../components/error-notice';
import {installedBlocksTypes, handleBlock} from '~starterblocks/stores/actionHelper';
import uniq from 'lodash/uniq';
import './style.scss'

import StarterBlocksTour from '../tour';


function LibraryModal(props) {
    const {
        fetchLibraryFromAPI, activeCollection, activeItemType, errorMessages, setLoading, setColumns, setLibrary,
        setImportingTemplate, switchEditorMode, createSuccessNotice, createErrorNotice,
        appendErrorMessage, discardAllErrorMessages, blockTypes, inserterItems, savePost, isSavingPost, installedDependencies, importingTemplate, editorMode
    } = props;
    const [loaded, setLoaded] = useState(false);
    const [missingPluginArray, setMissingPlugin] = useState([]);
    const [missingProArray, setMissingPro] = useState([]);

    let stateLibrary = null;
    useEffect(() => {
        stateLibrary = fetchLibraryFromAPI();
        if (stateLibrary === null && loaded === false) { // One to be called at first.
            setLoading(true);
            setLoaded(true);
        }
    });

    const hasSidebar = () => {
        return ((activeItemType !== 'collection' || activeCollection === null) && activeItemType !== 'saved');
    }

    // read block data to import and give the control to actual import
    const processImport = () => {
        discardAllErrorMessages();
        if (importingTemplate) processImportHelper(importingTemplate, registerError)
    }

    const processImportHelper = (data, errorCallback) => {
        const type = activeItemType === 'section' ? 'sections' : 'pages';
        let the_url = 'starterblocks/v1/template?type=' + type + '&id=' + data.id;
        if ('source' in data) {
            the_url += '&source=' + data.source;
        }

        const options = {
            method: 'GET',
            path: the_url,
            headers: {'Content-Type': 'application/json', 'Registered-Blocks': installedBlocksTypes()}
        };

        if (editorMode === 'text') {
            switchEditorMode();
        }


        apiFetch(options).then(response => {
            if (response.success && response.data) {
                let responseBlockData = response.data;
                if (Array.isArray(responseBlockData)) {
                    for (let blockData of responseBlockData)
                        handleBlock(blockData, installedDependencies);
                } else
                    handleBlock(responseBlockData, installedDependencies);
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


    const registerError = (errorMessage) => {
        appendErrorMessage(errorMessage);
        setImportingTemplate(null);
    }

    // Open Site Preview Modal
    const openSitePreviewModal = (index, item) => {
        ModalManager.openCustomizer(<PreviewModal startIndex={index} currentPageData={item}/>);
    }

    return (
        <Modal className="starterblocks-builder-modal-pages-list"
               customClass="starterblocks-builder-modal-template-list"
               openTimeoutMS={0} closeTimeoutMS={0}>
            <TabHeader/>
            {
                errorMessages && errorMessages.length > 0 &&
                <ErrorNotice discardAllErrorMessages={discardAllErrorMessages} errorMessages={errorMessages}/>
            }
            <div className="starterblocks-collections-modal-body">
                {hasSidebar() && <WithSidebarLayout/>}
                {(hasSidebar() === false && activeItemType === 'collection') && <CollectionView/>}
                {(hasSidebar() === false && activeItemType !== 'collection') && <SavedView/>}
            </div>
            {
                importingTemplate && <ImportWizard startImportTemplate={processImport} />
            }
            <StarterBlocksTour />
        </Modal>
    );
}


export default compose([
    withDispatch((dispatch) => {
        const {
            appendErrorMessage,
            discardAllErrorMessages,
            setLoading,
            setLibrary,
            setColumns,
            setImportingTemplate
        } = dispatch('starterblocks/sectionslist');
        const {savePost} = dispatch('core/editor');
        const { switchEditorMode } = dispatch( 'core/edit-post' );
        const {createSuccessNotice, createErrorNotice} = dispatch('core/notices');
        return {
            appendErrorMessage,
            discardAllErrorMessages,
            setLoading,
            savePost,
            setLibrary,
            switchEditorMode,
            setImportingTemplate,
            createSuccessNotice,
            createErrorNotice
        };
    }),

    withSelect((select, props) => {
        const {fetchLibraryFromAPI, getActiveCollection, getActiveItemType, getErrorMessages, getInstalledDependencies, getTourOpen, getImportingTemplate} = select('starterblocks/sectionslist');
        const { getEditorMode } = select('core/edit-post');
        return {
            fetchLibraryFromAPI,
            activeCollection: getActiveCollection(),
            activeItemType: getActiveItemType(),
            errorMessages: getErrorMessages(),
            installedDependencies: getInstalledDependencies(),
            editorMode: getEditorMode(),
            importingTemplate: getImportingTemplate()
        };
    })
])(LibraryModal);
