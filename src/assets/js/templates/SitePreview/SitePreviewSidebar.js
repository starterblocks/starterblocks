const { apiFetch } = wp;
const { Component } = wp.element
const { compose } = wp.compose;
const { withDispatch, withSelect, select } = wp.data;
const { parse } = wp.blocks;

import { Modal, ModalManager } from "../ModalManager"

import FullyOverlayHeader from "./FullyOverlayHeader";
import SidebarContent from "./SidebarContent";
import FullyOverlayFooter from "./FullyOverlayFooter";

function SitePreviewSidebar(props) {
    const { itemData, previewClass, expandedClass, activeItemType } = props;
    const { insertBlocks, onCloseCustomizer, onChangePreviewClass, onToggleExpanded, onNextBlock, onPrevBlock, discardAllErrorMessages, appendErrorMessage } = props;

    const importStarterBlock = () => {

        if (!starterblocks_admin.mokama && itemData.pro == true) {
            //
        } else {
            // this.setState({ spinner: itemData.ID })
            discardAllErrorMessages();
            let type = activeItemType === 'section' ? 'section' : 'page';
            let the_url = 'starterblocks/v1/template?type='+type+'&id=' + itemData.ID;
            if (itemData.source_id) {
                the_url += "&sid=" + itemData.source_id
            }

            const options = {
                method: 'GET',
                path: the_url,
                headers: { 'Content-Type': 'application/json' }
            }
            apiFetch(options).then(response => {
                if (response.success) {
                    //import collection
                    let pageData = parse(response.data.rawData);
                    insertBlocks(pageData);
                    ModalManager.closeCustomizer();
                    ModalManager.close(); //close modal
                } else {
                    appendErrorMessage(response.data.error);    
                }
            }).catch(error => {
                appendErrorMessage(error.code + ' : ' + error.message);
            });
        }
    }


    return (
        <div className="wp-full-overlay-sidebar">
            <FullyOverlayHeader onCloseCustomizer={onCloseCustomizer} onNextBlock={onNextBlock} onPrevBlock={onPrevBlock} 
                pro={itemData.pro} onImport={importStarterBlock} />
            <SidebarContent itemData={itemData} />
            <FullyOverlayFooter previewClass={previewClass} expandedClass={expandedClass} pro={itemData.pro}
                onChangePreviewClass={onChangePreviewClass} onToggleExpanded={onToggleExpanded} onImport={importStarterBlock} />
        </div>
    );
}


export default compose([
    withDispatch((dispatch) => {
        const {
            insertBlocks,
            removeBlock
        } = dispatch('core/block-editor');

        const {
            appendErrorMessage,
            discardAllErrorMessages
        } = dispatch('starterblocks/sectionslist');

        return {
            insertBlocks,
            removeBlock,
            appendErrorMessage,
            discardAllErrorMessages
        };
    }),

    withSelect((select, props) => {
        const { getActiveItemType } = select('starterblocks/sectionslist');
        return { activeItemType: getActiveItemType() };
    })

])(SitePreviewSidebar);