const {apiFetch} = wp;
const {parse} = wp.blocks;
const {compose} = wp.compose;
const {withDispatch, withSelect, select} = wp.data;
const {Component, Fragment, useState} = wp.element;
const {Spinner} = wp.components;

import "./stores/store";

import {TemplateModalProvider} from './contexts/TemplateModalContext';
import {Modal, ModalManager} from './ModalManager'
import TabHeader from './components/TabHeader';
import WithSidebarLayout from "./TemplatesList/WithSidebarLayout";
import CollectionView from "./TemplatesList/CollectionView";
import SavedView from "./TemplatesList/SavedView";
import SitePreviewCustomizer from "./SitePreview/SitePreviewCustomizer";
import ImportWizard from "./ImportWizard/ImportWizard";
import ErrorNotice from "./components/ErrorNotice";
import dependencyHelper from "./ImportWizard/dependencyHelper";
import uniq from 'lodash/uniq';
import './index.scss'

function TemplatesListModal(props) {
    const {fetchLibraryFromAPI, activeCollection, activeItemType, errorMessages, 
        insertBlocks, appendErrorMessage, discardAllErrorMessages, blockTypes, inserterItems, categories, savePost} = props;
    const [spinner, setSpinner] = useState(null);
    const [importingBlock, setImportingBlock] = useState(null);
    const [missingPluginArray, setMissingPlugin] = useState([]);
    const [missingProArray, setMissingPro] = useState([]);

    fetchLibraryFromAPI();

    const hasSidebar = () => {
        return ((activeItemType !== 'collection' || activeCollection === null) && activeItemType !== 'saved');
    }

    
    const onImportTemplate = (data) => {
        importStarterBlock(data, activeItemType === "section" ? "sections" : "pages");
    }

    const importStarterBlock = (data, type) => {
        const dependencies = dependencyHelper.checkTemplateDependencies(data);
        setMissingPlugin(dependencies.missingPluginArray);
        setMissingPro(dependencies.missingProArray);
        setImportingBlock(data);
    }


    // read block data to import and give the control to actual import
    const processImport = () => {
        const data = importingBlock;
        const type = activeItemType === "section" ? "sections" : "pages";

        discardAllErrorMessages();
        setSpinner(data.ID);

        let the_url = 'starterblocks/v1/template?type=' + type + '&id=' + data.ID;
        if (data.source_id) {
            the_url += "&sid=" + data.source_id + '&source=' + data.source;
        }
        the_url += '&p=' + JSON.stringify(starterblocks_admin.supported_plugins);
        const options = {
            method: 'GET',
            path: the_url,
            headers: {'Content-Type': 'application/json'}
        };
        apiFetch(options).then(response => {
            if (response.success && response.data.template) {
                //import template
                let pageData = parse(response.data.template);
                doImportTemplate(pageData);
                savePost().then(() => {
                    if (missingPluginArray.length > 0)
                        setTimeout(window.location.reload(), 1000);
                });
            } else {
                registerError(response.data.error);
            }
        }).catch(error => {
            registerError(error.code + ' : ' + error.message);
        });
    }

    // Final piece, insert read block data
    const doImportTemplate = (pageData) => {
        insertBlocks(pageData);
        ModalManager.close(); //close modal
    }

    const registerError = (errorMessage) => {
        appendErrorMessage(errorMessage);
        setSpinner(null);
    }

    // Open Site Preview Modal
    const openSitePreviewModal = (index, item) => {
        ModalManager.openCustomizer(<SitePreviewCustomizer startIndex={index} currentPageData={item}/>);
    }
    return (
        <Modal className="starterblocks-builder-modal-pages-list"
               customClass="starterblocks-builder-modal-template-list"
               openTimeoutMS={0} closeTimeoutMS={0}>
            <TabHeader/>
            <TemplateModalProvider value={{
                openSitePreviewModal,
                onImportTemplate,
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
                { importingBlock && <ImportWizard missingPlugins={uniq(missingPluginArray)} missingPros={uniq(missingProArray)} 
                startImportTemplate={processImport} closeWizard={() => setImportingBlock(null)} /> }
            </TemplateModalProvider>
        </Modal>
    );
}


export default compose([
    withDispatch((dispatch) => {
        const {
            insertBlocks
        } = dispatch('core/block-editor');

        const {
            appendErrorMessage,
            discardAllErrorMessages
        } = dispatch('starterblocks/sectionslist');

        const {savePost} = dispatch('core/editor');

        return {
            insertBlocks,
            appendErrorMessage,
            discardAllErrorMessages,
            savePost
        };
    }),

    withSelect((select, props) => {
        const {fetchLibraryFromAPI, getActiveCollection, getActiveItemType, getErrorMessages} = select('starterblocks/sectionslist');
        return {
            fetchLibraryFromAPI,
            activeCollection: getActiveCollection(),
            activeItemType: getActiveItemType(),
            errorMessages: getErrorMessages()
        };
    })
])(TemplatesListModal);