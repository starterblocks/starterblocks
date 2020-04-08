const {compose} = wp.compose;
const {withDispatch, withSelect} = wp.data;
const {Component, useState} = wp.element
const {Spinner} = wp.components;
const {__} = wp.i18n
import SitePreviewSidebar from './SitePreviewSidebar';
import {ModalManager} from '../modal-manager'
import ImportWizard from '../modal-import-wizard';
import dependencyHelper from '../modal-import-wizard/dependencyHelper';
import {processImportHelper} from '../stores/actionHelper';
import uniq from 'lodash/uniq';
import './style.scss';
import {Fragment} from 'react';

function PreviewModal(props) {

    const {startIndex, currentPageData} = props;
    const {discardAllErrorMessages, appendErrorMessage, activeItemType, setImportingTemplate, savePost, importingTemplate} = props;
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [previewClass, setPreviewClass] = useState('preview-desktop')
    const [expandedClass, toggleExpanded] = useState('expanded')
    const [importingBlock, setImportingBlock] = useState(null);
    const [missingPluginArray, setMissingPlugin] = useState([]);
    const [missingProArray, setMissingPro] = useState([]);


    const onCloseCustomizer = () => {
        ModalManager.closeCustomizer();
    }

    const onNextBlock = () => {
        if (currentIndex < currentPageData.length) setCurrentIndex(currentIndex + 1);
    }

    const onPrevBlock = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    }


    const importStarterBlock = () => {
        setImportingTemplate(itemData);
    }

    const processImport = () => {
        discardAllErrorMessages();
        processImportHelper(activeItemType === 'section' ? 'sections' : 'pages', appendErrorMessage);
    }

    let wrapperClassName = ['wp-full-overlay sites-preview theme-install-overlay ', previewClass, expandedClass].join(' ');
    let itemData = currentPageData[currentIndex];
    let image_url = itemData.image
    if (itemData.image_full) {
        image_url = itemData.image_full;
    }

    return (
        <Fragment>
            <div className={wrapperClassName} style={{display: 'block'}}>
                <SitePreviewSidebar itemData={itemData} previewClass={previewClass} expandedClass={expandedClass}
                                    onNextBlock={onNextBlock} onPrevBlock={onPrevBlock}
                                    onCloseCustomizer={onCloseCustomizer} onToggleExpanded={e => toggleExpanded(e)}
                                    onImport={importStarterBlock}
                                    onChangePreviewClass={e => setPreviewClass(e)}/>
                <div className=' wp-full-overlay-main'>
                    {itemData.url &&
                    <iframe src={itemData.url} target='Preview'></iframe>
                    }
                    {!itemData.url &&
                        <div className='starterblock-modal-preview-box'><img
                            src={image_url}
                            title=''/></div>

                    }

                </div>
            </div>
            { importingTemplate && <ImportWizard startImportTemplate={processImport} /> }
        </Fragment>
    );
}

export default compose([
    withDispatch((dispatch) => {
        const {
            appendErrorMessage,
            discardAllErrorMessages,
            setImportingTemplate
        } = dispatch('starterblocks/sectionslist');

        const {savePost} = dispatch('core/editor');

        return {
            appendErrorMessage,
            discardAllErrorMessages,
            setImportingTemplate,
            savePost
        };
    }),

    withSelect((select, props) => {
        const {getActiveItemType, getImportingTemplate} = select('starterblocks/sectionslist');
        return {activeItemType: getActiveItemType(), importingTemplate: getImportingTemplate()};
    })
])(PreviewModal);
