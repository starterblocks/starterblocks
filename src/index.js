/**
 * Library Button
 */

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'
import { render } from '@wordpress/element'

/**
 * External dependencies
 */
import './editor.scss'
import './plugins/sidebar-share'
import './plugins/share-block-btn'
import ToolbarLibraryButton from './toolbar-library-button'
import StarterBlocksTour from './tour/old'
import TooltipHolder from './challenge/tooltip/TooltipHolder';
import {handlingLocalStorageData} from './stores/helper';
import {ModalManager} from './modal-manager';
import LibraryModal from './modal-library';


domReady(() => {
	const toolbar = document.querySelector('.edit-post-header-toolbar')
	if (!toolbar) {
		return
	}
    const buttonDiv = document.createElement('div')
    const challengeDiv = document.createElement('div')
    const tourDiv = document.createElement('div')
    toolbar.appendChild(buttonDiv);
    toolbar.appendChild(challengeDiv);
    toolbar.appendChild(tourDiv);
    render(<ToolbarLibraryButton/>, buttonDiv)

    if(window.location.hash == '#starterblocks_tour=1') {
        window.location.hash = '';
        ModalManager.open(<LibraryModal />);
        render(<StarterBlocksTour autoTourStart={true} />, tourDiv);
    }
    else
        render(<StarterBlocksTour autoTourStart={false}/>, tourDiv);
    render(<TooltipHolder />, challengeDiv);

    handlingLocalStorageData();
});
