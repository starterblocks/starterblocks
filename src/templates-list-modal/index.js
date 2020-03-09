const {apiFetch} = wp;
const {parse} = wp.blocks;
const {compose} = wp.compose;
const {withDispatch, withSelect, select, subscribe} = wp.data;
const {Component, Fragment, useState, useRef} = wp.element;
const {Spinner} = wp.components;

import '../stores';

import {TemplateModalProvider} from '../contexts/TemplateModalContext';
import {Modal, ModalManager} from '../modal-manager'
import TabHeader from '../components/tab-header';
import WithSidebarLayout from './WithSidebarLayout';
import CollectionView from './CollectionView';
import SavedView from '../saved-view';
import PreviewTemplate from '../preview-template';
import ImportWizard from '../import-wizard';
import ErrorNotice from '../components/error-notice';
import {processImportHelper} from '../stores/helper';
import dependencyHelper from '../import-wizard/dependencyHelper';
import uniq from 'lodash/uniq';
import find from 'lodash/find';
import './style.scss'

function TemplatesListModal(props) {
	const {
		fetchLibraryFromAPI, activeCollection, activeItemType, errorMessages,
		insertBlocks, appendErrorMessage, discardAllErrorMessages, blockTypes,
		inserterItems, categories, savePost, notices
	} = props;
	const [spinner, setSpinner] = useState(null);
	const [saving, setSaving] = useState(false);
	const [importingBlock, setImportingBlock] = useState(null);
	const [missingPluginArray, setMissingPlugin] = useState([]);
	const [missingProArray, setMissingPro] = useState([]);

	fetchLibraryFromAPI();

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
		setSpinner(importingBlock.ID);

		processImportHelper(importingBlock, activeItemType === 'section' ? 'sections' : 'pages', registerError);
	}

	const registerError = (errorMessage) => {
		appendErrorMessage(errorMessage);
		setSpinner(null);
	}

	// Open Site Preview Modal
	const openSitePreviewModal = (index, item) => {
		ModalManager.openCustomizer(<PreviewTemplate startIndex={index} currentPageData={item}/>);
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
				{importingBlock &&
				<ImportWizard missingPlugins={uniq(missingPluginArray)} missingPros={uniq(missingProArray)}
							  startImportTemplate={processImport} closeWizard={() => setImportingBlock(null)}/>}
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
