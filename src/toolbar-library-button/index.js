/**
 * WordPress dependencies
 */
import { IconButton } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import './style.scss'

/**
 * External dependencies
 */
import {ModalManager} from '../modal-manager';
import LibraryModal from '../modal-library';
import { StarterBlocksIcon } from '~starterblocks/icons'

const ToolbarLibraryButton = () => {
	return (
		<IconButton
			onClick={ () => {
				ModalManager.open(<LibraryModal rowClientId={false}/>);
			} }
			className="sb-insert-library-button"
			label={ __( 'Open Library', starterblocks.i18n ) }
			icon={ <StarterBlocksIcon /> }
		>{ __( 'Library', starterblocks.i18n ) }</IconButton>
	)
}

export default ToolbarLibraryButton