const {apiFetch} = wp;
const {Component, useState} = wp.element
const {compose} = wp.compose;
const {withDispatch, withSelect, select} = wp.data;
const {parse} = wp.blocks;

import {Modal, ModalManager} from '../ModalManager'

import FullyOverlayHeader from './FullyOverlayHeader';
import SidebarContent from './SidebarContent';
import FullyOverlayFooter from './FullyOverlayFooter';

function SitePreviewSidebar(props) {
	const {itemData, previewClass, expandedClass, onImport} = props;
	const {onCloseCustomizer, onChangePreviewClass, onToggleExpanded, onNextBlock, onPrevBlock} = props;


	return (
		<div className="wp-full-overlay-sidebar">
			<FullyOverlayHeader onCloseCustomizer={onCloseCustomizer} onNextBlock={onNextBlock}
								onPrevBlock={onPrevBlock}
								pro={itemData.pro} onImport={onImport}/>
			<SidebarContent itemData={itemData}/>
			<FullyOverlayFooter previewClass={previewClass} expandedClass={expandedClass} pro={itemData.pro}
								onChangePreviewClass={onChangePreviewClass} onToggleExpanded={onToggleExpanded}
								onImport={onImport}/>
		</div>
	);
}


export default SitePreviewSidebar;
