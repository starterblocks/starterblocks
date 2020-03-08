/**
 * WordPress dependencies
 */
import { IconButton } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import './style.scss'

/**
 * External dependencies
 */
import {ModalManager} from '../templates/ModalManager';
import TemplatesListModal from '../templates/TemplatesListModal';
import { SVGStarterBlocks } from '~starterblocks/icons'

const LibraryToolbarButton = () => {
	return (
		<IconButton
			onClick={ () => {
				ModalManager.open(<TemplatesListModal rowClientId={false}/>);
			} }
			className="sb-insert-library-button"
			label={ __( 'Open Library', starterblocks.i18n ) }
			icon={ <SVGStarterBlocks /> }
		>{ __( 'Library', starterblocks.i18n ) }</IconButton>
	)
}

export default LibraryToolbarButton
