/**
 * External dependencies
 */
import React, { Component }  from 'react';
import SVGStarterBlocksIcon from './images/starterblocks-icon.svg'
import SVGAdvancedGutenbergBlocksIcon from './images/third-party/advanced-gutenberg-blocks.svg'

/**
 * WordPress dependencies
 */
import { cloneElement, render } from '@wordpress/element'
import domReady from '@wordpress/dom-ready'
import { updateCategory } from '@wordpress/blocks'

export const colorizeIcon = SvgIcon => {
	return cloneElement( SvgIcon, {
		fill: 'url(#starterblocks-gradient)',
		className: 'sb-starterblocks-icon-gradient',
	} )
}

// Add an icon to our block category.
if ( typeof window.wp.blocks !== 'undefined' && typeof window.wp.blocks.updateCategory !== 'undefined' ) {
	updateCategory( 'starterblocks', {
		icon: colorizeIcon( <SVGStarterBlocksIcon className="components-panel__icon" width="20" height="20" /> ),
	} )
}

// Add our SVG gradient placeholder definition that we'll reuse.
domReady( () => {
	const stackableGradient = document.createElement( 'DIV' )
	document.querySelector( 'body' ).appendChild( stackableGradient )
	render(
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="sb-starterblocks-gradient"
			height="0"
			width="0"
			style={ { opacity: 0 } }
		>
			<defs>
				<linearGradient id="starterblocks-gradient">
					<stop offset="0%" stopColor="#8c33da" stopOpacity="1" />
					<stop offset="100%" stopColor="#f34957" stopOpacity="1" />
				</linearGradient>
			</defs>
		</svg>,
		stackableGradient
	)
} )

export const SVGStarterBlocks = () => {
	return <SVGStarterBlocksIcon width="20" height="20" />
}

export const StarterBlocksColor = () => {
	return colorizeIcon( <SVGStarterBlocksIcon width="20" height="20" /> )
}

export const GhostButtonIcon = () => <ButtonIcon />
