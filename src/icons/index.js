/**
 * External dependencies
 */
import React, {Component} from 'react';
import SVGStarterBlocksIcon from './images/starterblocks-icon.svg'
import SVGAdvancedGutenbergBlocksIcon from './images/third-party/advanced-gutenberg-blocks.svg'
import SVGCoBlocksIcon from './images/third-party/coblocks.svg'
import SVGCreativeBlocksIcon from './images/third-party/creative-blocks.svg'
import SVGKiokenIcon from './images/third-party/kioken.svg'
import SVGEssentialBlocksIcon from './images/third-party/eb.svg'
import SVGElegantBlocksIcon from './images/third-party/elegant-blocks.svg'
import SVGQubelyIcon from './images/third-party/qubely.svg'
import SVGStackableIcon from './images/third-party/ugb.svg'

/**
 * WordPress dependencies
 */
import {cloneElement, render} from '@wordpress/element'
import domReady from '@wordpress/dom-ready'
import {updateCategory} from '@wordpress/blocks'

export const colorizeIcon = SvgIcon => {
	return cloneElement(SvgIcon, {
		fill: 'url(#starterblocks-gradient)',
		className: 'sb-starterblocks-icon-gradient',
	})
}

// Add an icon to our block category.
if (typeof window.wp.blocks !== 'undefined' && typeof window.wp.blocks.updateCategory !== 'undefined') {
	updateCategory(starterblocks.i18n, {
		icon: colorizeIcon(<SVGStarterBlocksIcon className="components-panel__icon" width="20" height="20"/>),
	})
}

// Add our SVG gradient placeholder definition that we'll reuse.
domReady(() => {
	const starterblocksGradient = document.createElement('DIV')
	document.querySelector('body').appendChild(starterblocksGradient)
	render(
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="sb-starterblocks-gradient"
			height="0"
			width="0"
			style={{opacity: 0}}
		>
			<defs>
				<linearGradient id="starterblocks-gradient">
					<stop offset="0%" stopColor="#8c33da" stopOpacity="1"/>
					<stop offset="100%" stopColor="#f34957" stopOpacity="1"/>
				</linearGradient>
			</defs>
		</svg>,
		starterblocksGradient
	)
})

export const StarterBlocksIcon = () => {
	return <SVGStarterBlocksIcon width="20" height="20"/>
}

export const StarterBlocksIconColor = () => {
	return colorizeIcon(<SVGStarterBlocksIcon width="20" height="20"/>)
}

export const AdvancedGutenbergBlocks = () => {
	return <SVGAdvancedGutenbergBlocksIcon width="20" height="20"/>
}
export const advancedgutenbergblocks = () => <AdvancedGutenbergBlocks/>

export const AdvancedGutenberg = () => {
	return <SVGAdvancedGutenbergIcon width="20" height="20"/>
}
export const advancedgutenbergIcon = () => <AdvancedGutenberg/>

export const AtomicBlocks = () => {
	return <SVGAtomicBlocksIcon width="20" height="20"/>
}
export const atomicblocks = () => <AtomicBlocks/>

export const CoBlocks = () => {
	return <SVGCoBlocksIcon width="20" height="20"/>
}
export const Coblocks = () => <CoBlocks/>
export const coblocks = () => <CoBlocks/>

export const Stackable = () => {
	return <SVGStackableIcon width="20" height="20"/>
}
export const stackable = () => <Stackable/>
export const ugb = () => <Stackable/>

export const Qubely = () => {
	return <SVGQubelyIcon width="20" height="20"/>
}
export const qubely = () => <Qubely/>

export const Kioken = () => {
    return <SVGKiokenIcon width="20" height="20"/>
}
export const kioken = () => <Kioken/>


export const CreativeBlocks = () => {
	return <SVGCreativeBlocksIcon width="20" height="20"/>
}
export const creativeblocks = () => <CreativeBlocks/>
export const qb = () => <CreativeBlocks/>

export const EssentialBlocks = () => {
	return <SVGEssentialBlocksIcon width="20" height="20"/>
}
export const essentialblocks = () => <EssentialBlocks/>
export const eb = () => <EssentialBlocks/>

