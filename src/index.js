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
import React from 'react'
import ReactDOM from 'react-dom'
import './editor.scss'
import './share-sidebar'
import LibraryToolbarButton from './library-toolbar-button'


domReady(() => {
	const toolbar = document.querySelector('.edit-post-header-toolbar')
	if (!toolbar) {
		return
	}
	const buttonDiv = document.createElement('div')
	toolbar.appendChild(buttonDiv)
	render(<LibraryToolbarButton/>, buttonDiv)
})
