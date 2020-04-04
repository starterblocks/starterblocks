const {apiFetch} = wp;
const {parse} = wp.blocks;
const {compose} = wp.compose;
const {withDispatch, withSelect, select, subscribe} = wp.data;
const {Component, Fragment, useState, useEffect, useRef} = wp.element;
const {Spinner} = wp.components;

import '../stores';

import {disableBodyScroll, enableBodyScroll} from 'body-scroll-lock';
import Tour from 'reactour';

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

import {tourConfig} from '../tour';


function LibraryModal(props) {
    const {
        fetchLibraryFromAPI, activeCollection, activeItemType, errorMessages, setLoading, setColumns, setLibrary, setTourOpen,
        appendErrorMessage, discardAllErrorMessages, blockTypes, inserterItems, savePost, isSavingPost, installedDependencies, isTourOpen
    } = props;
    const accentColor = '#5cb7b7';

    const [spinner, setSpinner] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [importingBlock, setImportingBlock] = useState(null);
    const [missingPluginArray, setMissingPlugin] = useState([]);
    const [missingProArray, setMissingPro] = useState([]);
    const wasSaving = useRef(false);

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

    const useDidSave = () => {
        const hasJustSaved = wasSaving.current && !isSavingPost;
        wasSaving.current = isSavingPost;
        return hasJustSaved;
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

    const disableBody = target => disableBodyScroll(target);
    const enableBody = target => enableBodyScroll(target);

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
            </TemplateModalProvider>
            <Tour
                onRequestClose={() => setTourOpen(false)}
                steps={tourConfig}
                isOpen={isTourOpen}
                maskClassName="mask"
                className="helper"
                rounded={5}
                accentColor={accentColor}
            />
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
            setTourOpen
        } = dispatch('starterblocks/sectionslist');
        const {savePost} = dispatch('core/editor');

        return {
            appendErrorMessage,
            discardAllErrorMessages,
            setLoading,
            savePost,
            setLibrary,
            setTourOpen
        };
    }),

    withSelect((select, props) => {
        const {fetchLibraryFromAPI, getActiveCollection, getActiveItemType, getErrorMessages, getInstalledDependencies, getTourOpen} = select('starterblocks/sectionslist');
        return {
            fetchLibraryFromAPI,
            activeCollection: getActiveCollection(),
            activeItemType: getActiveItemType(),
            errorMessages: getErrorMessages(),
            installedDependencies: getInstalledDependencies(),
            isTourOpen: getTourOpen()
        };
    })
])(LibraryModal);
