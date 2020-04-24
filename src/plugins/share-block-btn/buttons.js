import {noop} from 'lodash'
import {kebabCase} from 'lodash';
import {Fragment} from '@wordpress/element'
import {__} from '@wordpress/i18n'
import {setGroupingBlockName, switchToBlockType} from '@wordpress/blocks'
import {
    select, withSelect, withDispatch,
} from '@wordpress/data'
import {compose} from '@wordpress/compose'
import {PluginBlockSettingsMenuItem} from '@wordpress/edit-post'
import StarterblocksIcon from './icons'
import {Modal, ModalManager} from '../../modal-manager'
import ShareModal from './modal'

import {download} from '~starterblocks/plugins/export'

/**
 * Based on: https://github.com/WordPress/gutenberg/blob/master/packages/editor/src/components/convert-to-group-buttons/convert-button.js
 */


/**
 * Internal dependencies
 */

const saveData = (function () {
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    return function (data, fileName, type) {
        if (!type || (type && type != 'html')) {
            data = JSON.stringify(data)
        }
        var blob = new Blob([data], {type: 'octet/stream'}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());


export function ShareBlockButton(
    {
        blocksSelection,
        onExportBlock,
    }
) {
    // Only supported by WP >= 5.3.
    if (!select('core/block-editor').getSelectedBlockClientIds) {
        return null
    }

    const onShareBlock = () => {
        if (!blocksSelection.length) {
            return
        }
        ModalManager.open(<ShareModal blocksSelection={blocksSelection}/>);
    }

    return (
        <Fragment>
            <PluginBlockSettingsMenuItem
                icon={StarterblocksIcon}
                label={__('Share Block', 'starterblocks')}
                onClick={onShareBlock}
            />
            {/*<PluginBlockSettingsMenuItem*/}
            {/*    icon={StarterblocksIcon}*/}
            {/*    label={__('Export as Reusable Block', 'starterblocks')}*/}
            {/*    onClick={onExportBlock}*/}
            {/*/>*/}
        </Fragment>
    )
}

export default compose([
    withSelect((select, {clientIds}) => {
        const {
            getBlockRootClientId,
            getBlocksByClientId,
            canInsertBlockType,
        } = select('core/block-editor')

        const rootClientId = clientIds && clientIds.length > 0 ?
            getBlockRootClientId(clientIds[0]) :
            undefined

        const blocksSelection = getBlocksByClientId(clientIds)

        return {
            blocksSelection,

        }
    }),
    withDispatch((dispatch, {
        clientIds, onToggle = noop, blocksSelection = [],
    }) => {
        const {
            replaceBlocks,
        } = dispatch('core/block-editor')

        return {
            onExportBlock() {
                if (!blocksSelection.length) {
                    return
                }

                console.log(blocksSelection);

                let blocks = wp.data.select('core/block-editor').getBlocks();
                let fileName = 'blocks.json'

                const title = select('core/block-editor').getSelectedBlockName();
                const content = select('core/block-editor').getSelectedBlockClientId();
                // const content = post.content.raw;
                const fileContent = JSON.stringify(
                    {
                        __file: 'wp_block',
                        title,
                        content,
                    },
                    null,
                    2
                );
                console.log(fileContent);
                // const theFileName = kebabCase( title ) + '.json';
                //
                // download( theFileName, fileContent, 'application/json' );
                //
                //
                //
                // if (blocksSelection.length == 1) {
                //     fileName = blocksSelection[0].name.replace('/', '_') + '.json'
                // }
                //
                // saveData(blocksSelection, fileName, 'json');

                onToggle()
            },
        }
    }),
])(ShareBlockButton)
