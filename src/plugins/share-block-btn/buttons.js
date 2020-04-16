import { noop } from 'lodash'
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { setGroupingBlockName, switchToBlockType } from '@wordpress/blocks'
import {
    select, withSelect, withDispatch,
} from '@wordpress/data'
import { compose } from '@wordpress/compose'
import { PluginBlockSettingsMenuItem } from '@wordpress/edit-post'
import StarterblocksIcon from './icons'

export function ShareBlockButton( {
    onShareBlock
} ) {
    if ( ! select( 'core/block-editor' ).getSelectedBlockClientIds ) {
        return null
    }

    return (
        <PluginBlockSettingsMenuItem
            icon={ StarterblocksIcon }
            label={ __( 'Share this Design' ) }
            onClick={ onShareBlock }
        />
    )
}

export default compose( [
    withSelect( ( select, { clientIds } ) => {
        const {
            getBlocksByClientId
        } = select( 'core/block-editor' )

        const blocksSelection = getBlocksByClientId( clientIds )

        return {
            blocksSelection
        }
    } ),
    withDispatch( ( dispatch, {
        clientIds, onToggle = noop, blocksSelection = [], groupingBlockName,
    } ) => {
        const {
            replaceBlocks,
        } = dispatch( 'core/block-editor' )

        return {
            onShareBlock() {
                if ( ! blocksSelection.length ) {
                    return
                }

                onToggle()
            },
        }
    } ),
] )( ShareBlockButton )
