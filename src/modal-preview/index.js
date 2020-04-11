const {compose} = wp.compose;
const {withDispatch, withSelect} = wp.data;
const {Component, useState} = wp.element
const {Spinner} = wp.components;
const {__} = wp.i18n
import SitePreviewSidebar from './SitePreviewSidebar';
import {ModalManager} from '../modal-manager'
import ImportWizard from '../modal-import-wizard';
import uniq from 'lodash/uniq';
import './style.scss';
import {Fragment} from 'react';
import {handleBlock, processImportHelper} from '~starterblocks/stores/actionHelper';

function PreviewModal(props) {

    const {startIndex, currentPageData} = props;
    const {discardAllErrorMessages, activeItemType, setImportingTemplate, savePost, switchEditorMode, editorMode,
        createSuccessNotice, createErrorNotice, importingTemplate, installedDependencies} = props;
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
        ModalManager.closeCustomizer();
    }

    const processImport = () => {
        if (importingTemplate) processImportHelper();
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
            setImportingTemplate
        } = dispatch('starterblocks/sectionslist');

        const {savePost} = dispatch('core/editor');
        const { switchEditorMode } = dispatch( 'core/edit-post' );
        const {createSuccessNotice, createErrorNotice} = dispatch('core/notices');
        return {
            setImportingTemplate,
            savePost,
            switchEditorMode,
            createSuccessNotice,
            createErrorNotice
        };
    }),

    withSelect((select, props) => {
        const {getActiveItemType, getImportingTemplate, getInstalledDependencies} = select('starterblocks/sectionslist');
        const {getEditorMode} = select('core/edit-post');
        return {
            activeItemType: getActiveItemType(),
            importingTemplate: getImportingTemplate(),
            installedDependencies: getInstalledDependencies(),
            editorMode: getEditorMode()
        };
    })
])(PreviewModal);
