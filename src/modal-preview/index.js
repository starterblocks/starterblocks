const { compose } = wp.compose;
const { withDispatch, withSelect } = wp.data;
const { Component, useState } = wp.element
const { Spinner } = wp.components;
const { __ } = wp.i18n
import SitePreviewSidebar from './SitePreviewSidebar';
import { ModalManager } from '../modal-manager'
import ImportWizard from '../modal-import-wizard';
import dependencyHelper from '../modal-import-wizard/dependencyHelper';
import {processImportHelper} from '../stores/helper';
import uniq from 'lodash/uniq';
import './style.scss';
import { Fragment } from 'react';

function PreviewModal(props) {

    const { startIndex, currentPageData } = props;
    const { discardAllErrorMessages, appendErrorMessage, activeItemType, savePost, installedDependencies} = props;
    const [ currentIndex, setCurrentIndex ] = useState(startIndex);
    const [ previewClass, setPreviewClass ] = useState('preview-desktop')
    const [ expandedClass, toggleExpanded ] = useState('expanded')
    const [ importingBlock, setImportingBlock ] = useState(null);
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
        const type = activeItemType === 'section' ? 'section' : 'page';
        const dependencies = dependencyHelper.checkTemplateDependencies(itemData);
        setMissingPlugin(dependencies.missingPluginArray);
        setMissingPro(dependencies.missingProArray);
        setImportingBlock(itemData);
    }

    const processImport = () => {
        discardAllErrorMessages();
		processImportHelper(itemData, activeItemType === 'section' ? 'sections' : 'pages', installedDependencies, appendErrorMessage);
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
            { importingBlock && <ImportWizard missingPlugins={uniq(missingPluginArray)} missingPros={uniq(missingProArray)}
                startImportTemplate={processImport} closeWizard={() => setImportingBlock(null)} /> }
        </Fragment>
    );
}

export default compose([
    withDispatch((dispatch) => {
        const {
            appendErrorMessage,
            discardAllErrorMessages
        } = dispatch('starterblocks/sectionslist');

		const {savePost} = dispatch('core/editor');

        return {
            appendErrorMessage,
            discardAllErrorMessages,
            savePost
        };
    }),

    withSelect((select, props) => {
        const { getActiveItemType, getInstalledDependencies } = select('starterblocks/sectionslist');
        return { activeItemType: getActiveItemType(), installedDependencies: getInstalledDependencies() };
    })
])(PreviewModal);
