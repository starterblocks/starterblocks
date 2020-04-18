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
import StarterBlocksTour from './tour'
import {handlingLocalStorageData} from './stores/helper';

domReady(() => {
	const toolbar = document.querySelector('.edit-post-header-toolbar')
	if (!toolbar) {
		return
	}
    const buttonDiv = document.createElement('div')
    const tourDiv = document.createElement('div')
    toolbar.appendChild(buttonDiv)
    toolbar.appendChild(tourDiv)
    render(<ToolbarLibraryButton/>, buttonDiv)
    if (starterblocks.tour === '1')
        render(<StarterBlocksTour autoTourStart={true} />, tourDiv);
    else
        render(<StarterBlocksTour autoTourStart={false} />, tourDiv);
    handlingLocalStorageData();
});