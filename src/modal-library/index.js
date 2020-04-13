const {compose} = wp.compose;
const {withDispatch, withSelect, select} = wp.data;
const {useState, useEffect} = wp.element;

import {Modal, ModalManager} from '../modal-manager'
import TabHeader from '../components/tab-header';
import WithSidebarLayout from './layout-with-sidebar';
import CollectionView from './view-collection';
import SavedView from './view-saved';
import PreviewModal from '../modal-preview';
import ImportWizard from '../modal-import-wizard';
import ErrorNotice from '../components/error-notice';
import {processImportHelper} from '~starterblocks/stores/actionHelper';
import uniq from 'lodash/uniq';
import './style.scss'

import StarterBlocksTour from '../tour';


function LibraryModal(props) {
    const {
        fetchLibraryFromAPI, activeCollection, activeItemType, errorMessages, importingTemplate,
        setLoading, setLibrary, setImportingTemplate,
        autoTourStart
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
    }, []);


    const hasSidebar = () => {
        return ((activeItemType !== 'collection' || activeCollection === null) && activeItemType !== 'saved');
    }

    // read block data to import and give the control to actual import
    const processImport = () => {
        if (importingTemplate) processImportHelper();
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
            <StarterBlocksTour autoTourStart={autoTourStart} />
        </Modal>
    );
}


export default compose([
    withDispatch((dispatch) => {
        const {
            setLoading,
            setLibrary,
            setImportingTemplate
        } = dispatch('starterblocks/sectionslist');

        return {
            setLoading,
            setLibrary,
            setImportingTemplate,
        };
    }),

    withSelect((select, props) => {
        const {fetchLibraryFromAPI, getActiveCollection, getActiveItemType, getErrorMessages, getImportingTemplate} = select('starterblocks/sectionslist');
        return {
            fetchLibraryFromAPI,
            activeCollection: getActiveCollection(),
            activeItemType: getActiveItemType(),
            errorMessages: getErrorMessages(),
            importingTemplate: getImportingTemplate()
        };
    })
])(LibraryModal);
