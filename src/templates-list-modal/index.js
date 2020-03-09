const {apiFetch} = wp;
const {parse} = wp.blocks;
const {compose} = wp.compose;
const {withDispatch, withSelect, select, subscribe} = wp.data;
const {Component, Fragment, useState, useRef} = wp.element;
const {Spinner} = wp.components;
const {isSavingPost} = select('core/editor');

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
	const savePostNotice = find(notices, {id: 'SAVE_POST_NOTICE_ID'});
	if ( savePostNotice && savePostNotice.status === 'success' ) {
		window.location.reload();
	}

	// read block data to import and give the control to actual import
	const processImport = () => {
		const data = importingBlock;
		const type = activeItemType === 'section' ? 'sections' : 'pages';

		discardAllErrorMessages();
		setSpinner(data.ID);

		let the_url = 'starterblocks/v1/template?type=' + type + '&id=' + data.ID;
		if (data.source_id) {
			the_url += '&sid=' + data.source_id + '&source=' + data.source;
		}
		the_url += '&p=' + JSON.stringify(starterblocks.supported_plugins);
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
				setTimeout(() => {
					savePost().then(() => {
						window.location.reload();
					});
				}, 5000);
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
		// ModalManager.close(); //close modal
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
		const {getNotices} = select('core/notices');
		return {
			fetchLibraryFromAPI,
			activeCollection: getActiveCollection(),
			activeItemType: getActiveItemType(),
			errorMessages: getErrorMessages(),
			notices: getNotices()
		};
	})
])(TemplatesListModal);
