const { compose } = wp.compose;
const { withDispatch, withSelect } = wp.data;
const { Component, useState } = wp.element
const { Spinner } = wp.components;
const { __ } = wp.i18n
import SitePreviewSidebar from './SitePreviewSidebar';
import { ModalManager } from '../modal-manager'
import ImportWizard from '../import-wizard';
import {handleBlock} from '~starterblocks/stores/actionHelper';
import uniq from 'lodash/uniq';
import './style.scss';
import { Fragment } from 'react';

function PreviewTemplate(props) {

    const { startIndex, currentPageData } = props;
    const { setImportingTemplate, discardAllErrorMessages, appendErrorMessage, activeItemType, savePost, editorMode, switchEditorMode,
        createSuccessNotice, createErrorNotice, installedDependencies, importingTemplate} = props;
    const [ currentIndex, setCurrentIndex ] = useState(startIndex);
    const [ previewClass, setPreviewClass ] = useState('preview-desktop')
    const [ expandedClass, toggleExpanded ] = useState('expanded')
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
		processImportHelper(importingTemplate, appendErrorMessage);
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

    let wrapperClassName = ['wp-full-overlay sites-preview theme-install-overlay ', previewClass, expandedClass].join(' ');
    let itemData = currentPageData[currentIndex];
    return (
        <Fragment>
            <div className={wrapperClassName} style={{display: 'block'}}>
                <SitePreviewSidebar itemData={itemData} previewClass={previewClass} expandedClass={expandedClass}
                    onNextBlock={onNextBlock} onPrevBlock={onPrevBlock}
                    onCloseCustomizer={onCloseCustomizer} onToggleExpanded={e => toggleExpanded(e)}
                    onImport={importStarterBlock}
                    onChangePreviewClass={e => setPreviewClass(e)} />
                <div className='wp-full-overlay-main'>
                    <iframe src={itemData.url} target='Preview'></iframe>
                </div>
            </div>
            { importingTemplate && <ImportWizard startImportTemplate={processImport} /> }
        </Fragment>
    );
}

export default compose([
    withDispatch((dispatch) => {
        const {
            setImportingTemplate,
            appendErrorMessage,
            discardAllErrorMessages
        } = dispatch('starterblocks/sectionslist');

		const {savePost} = dispatch('core/editor');
        const { switchEditorMode } = dispatch( 'core/edit-post' );
        const {createSuccessNotice, createErrorNotice} = dispatch('core/notices');
        return {
            setImportingTemplate,
            appendErrorMessage,
            discardAllErrorMessages,
            switchEditorMode,
            savePost,
            createSuccessNotice,
            createErrorNotice
        };
    }),

    withSelect((select, props) => {
        const { getActiveItemType, getInstalledDependencies, getImportingTemplate } = select('starterblocks/sectionslist');
        const { getEditorMode } = select('core/edit-post');
        return {
            activeItemType: getActiveItemType(),
            installedDependencies: getInstalledDependencies(),
            importingTemplate: getImportingTemplate(),
            editorMode: getEditorMode()
        };
    })
])(PreviewTemplate);
