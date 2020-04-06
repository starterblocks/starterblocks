const {apiFetch} = wp;
const {parse} = wp.blocks;
const {compose} = wp.compose;
const {withDispatch, withSelect, select} = wp.data;
const {Fragment, useState, useEffect} = wp.element;
const {Spinner} = wp.components;

import '../stores';


import {TemplateModalProvider} from '../contexts/TemplateModalContext';
import {Modal, ModalManager} from '../modal-manager'
import TabHeader from '../components/tab-header';
import WithSidebarLayout from './layout-with-sidebar';
import CollectionView from './view-collection';
import SavedView from './view-saved';
import PreviewModal from '../modal-preview';
import ImportWizard from '../modal-import-wizard';
import ErrorNotice from '../components/error-notice';
import {installedBlocksTypes, processImportHelper} from '~starterblocks/stores/helper';
import dependencyHelper from '../modal-import-wizard/dependencyHelper';
import uniq from 'lodash/uniq';
import './style.scss'

import StarterBlocksTour from '../tour';


function LibraryModal(props) {
    const {
        fetchLibraryFromAPI, activeCollection, activeItemType, errorMessages, setLoading, setColumns, setLibrary,
        appendErrorMessage, discardAllErrorMessages, blockTypes, inserterItems, savePost, isSavingPost, installedDependencies
    } = props;

    const [spinner, setSpinner] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [importingBlock, setImportingBlock] = useState(null);
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

    const resetLibrary = () => {
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
            }
        ).catch((error) => {
            registerError(error);
        });
    }

    const hasSidebar = () => {
        return ((activeItemType !== 'collection' || activeCollection === null) && activeItemType !== 'saved');
    }


    const onImportTemplate = (data) => {
        importStarterBlock(data, activeItemType === 'section' ? 'sections' : 'pages');
    }

    const importStarterBlock = (data, type) => {
        const dependencies = dependencyHelper.checkTemplateDependencies(data);
        setMissingPlugin(dependencies.missingPluginArray);
        setMissingPro(dependencies.missingProArray);
        setImportingBlock(data);
    }

    // read block data to import and give the control to actual import
    const processImport = () => {
        discardAllErrorMessages();
        setSpinner(null);
        processImportHelper(importingBlock, activeItemType === 'section' ? 'sections' : 'pages', installedDependencies, registerError)
    }


    const registerError = (errorMessage) => {
        appendErrorMessage(errorMessage);
        setSpinner(null);
        setImportingBlock(null);
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
            <TemplateModalProvider value={{
                openSitePreviewModal,
                onImportTemplate,
                resetLibrary,
                spinner
            }}>
                {
                    errorMessages && errorMessages.length > 0 &&
                    <ErrorNotice discardAllErrorMessages={discardAllErrorMessages} errorMessages={errorMessages}/>
                }
                <div className="starterblocks-collections-modal-body">
                    {hasSidebar() && <WithSidebarLayout/>}
                    {(hasSidebar() === false && activeItemType === 'collection') && <CollectionView/>}
                    {(hasSidebar() === false && activeItemType !== 'collection') && <SavedView/>}
                </div>
                {importingBlock &&
                <ImportWizard missingPlugins={uniq(missingPluginArray)} missingPros={uniq(missingProArray)}
                              startImportTemplate={processImport} closeWizard={() => setImportingBlock(null)}/>}
                <StarterBlocksTour />
            </TemplateModalProvider>
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
            setColumns
        } = dispatch('starterblocks/sectionslist');
        const {savePost} = dispatch('core/editor');

        return {
            appendErrorMessage,
            discardAllErrorMessages,
            setLoading,
            savePost,
            setLibrary
        };
    }),

    withSelect((select, props) => {
        const {fetchLibraryFromAPI, getActiveCollection, getActiveItemType, getErrorMessages, getInstalledDependencies, getTourOpen} = select('starterblocks/sectionslist');
        return {
            fetchLibraryFromAPI,
            activeCollection: getActiveCollection(),
            activeItemType: getActiveItemType(),
            errorMessages: getErrorMessages(),
            installedDependencies: getInstalledDependencies()
        };
    })
])(LibraryModal);
