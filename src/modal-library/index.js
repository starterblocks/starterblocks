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
import {installedBlocksTypes, processImportHelper} from '~starterblocks/stores/actionHelper';
import dependencyHelper from '../modal-import-wizard/dependencyHelper';
import uniq from 'lodash/uniq';
import './style.scss'

import StarterBlocksTour from '../tour';


function LibraryModal(props) {
    const {
        fetchLibraryFromAPI, activeCollection, activeItemType, errorMessages, setLoading, setColumns, setLibrary, setImportingTemplate,
        appendErrorMessage, discardAllErrorMessages, blockTypes, inserterItems, savePost, isSavingPost, installedDependencies, importingTemplate
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
        processImportHelper(activeItemType === 'section' ? 'sections' : 'pages', registerError)
        setImportingTemplate(null);
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

        return {
            appendErrorMessage,
            discardAllErrorMessages,
            setLoading,
            savePost,
            setLibrary,
            setImportingTemplate
        };
    }),

    withSelect((select, props) => {
        const {fetchLibraryFromAPI, getActiveCollection, getActiveItemType, getErrorMessages, getInstalledDependencies, getTourOpen, getImportingTemplate} = select('starterblocks/sectionslist');
        return {
            fetchLibraryFromAPI,
            activeCollection: getActiveCollection(),
            activeItemType: getActiveItemType(),
            errorMessages: getErrorMessages(),
            installedDependencies: getInstalledDependencies(),
            importingTemplate: getImportingTemplate()
        };
    })
])(LibraryModal);
