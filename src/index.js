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
import './sidebar-share'
import ToolbarLibraryButton from './toolbar-library-button'


domReady(() => {
	const toolbar = document.querySelector('.edit-post-header-toolbar')
	if (!toolbar) {
		return
	}
	const buttonDiv = document.createElement('div')
	toolbar.appendChild(buttonDiv)
	render(<ToolbarLibraryButton/>, buttonDiv)
});
