import {noop} from 'lodash'
import {Fragment} from '@wordpress/element'
import {__} from '@wordpress/i18n'
import {setGroupingBlockName, switchToBlockType} from '@wordpress/blocks'
import {
    select, withSelect, withDispatch,
} from '@wordpress/data'
import {compose} from '@wordpress/compose'
import {PluginBlockSettingsMenuItem} from '@wordpress/edit-post'
import StarterblocksIcon from './icons'


//
// export function ShareBlockButton({
//                                      onShareBlock,
//                                      onExportBlock
//                                  }) {
//     if (!select('core/block-editor').getSelectedBlockClientIds) {
//         return null
//     }
//
//     return (
//         <PluginBlockSettingsMenuItem
//             icon={StarterblocksIcon}
//             label={__('Share this Design')}
//             onClick={onShareBlock}
//         />
//         // ,
//         // {/*<PluginBlockSettingsMenuItem*/}
//         // {/*    icon={StarterblocksIcon}*/}
//         // {/*    label={__('Export Template (JSON)')}*/}
//         // {/*    onClick={onExportBlock('json')}*/}
//         // {/*/>,*/}
//         // {/*<PluginBlockSettingsMenuItem*/}
//         // {/*    icon={StarterblocksIcon}*/}
//         // {/*    label={__('Export Template (HTML)')}*/}
//         // {/*    onClick={onExportBlock('html')}*/}
//         // {/*/>*/}
//     )
// }
//
// export default compose([
//     withSelect((select, {clientIds}) => {
//         const {
//             getBlocksByClientId
//         } = select('core/block-editor')
//
//         const blocksSelection = getBlocksByClientId(clientIds)
//
//         return {
//             blocksSelection
//         }
//     }),
//     withDispatch((dispatch, {
//         clientIds, onToggle = noop, blocksSelection = [], groupingBlockName,
//     }) => {
//         const {
//             replaceBlocks,
//         } = dispatch('core/block-editor')
//
//         return {
//             onShareBlock() {
//                 if (!blocksSelection.length) {
//                     return
//                 }
//
//                 onToggle()
//             },
//             onExportBlock(type) {
//                 if (!blocksSelection.length) {
//                     return
//                 }
//                 alert('here');
//             },
//
//
//         }
//     }),
// ])(ShareBlockButton2)
//
//


/**
 * Based on: https://github.com/WordPress/gutenberg/blob/master/packages/editor/src/components/convert-to-group-buttons/convert-button.js
 */


/**
 * Internal dependencies
 */
import {Group, Ungroup} from './icons'

const saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName, type) {
        if (!type || (type && type != 'html')) {
            data = JSON.stringify(data)
        }
        var blob = new Blob([data], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());


export function ShareBlockButton(
    {
        onShareBlock,
        onExportBlockJSON,
        onExportBlockHTML,
        onExportBlockReusable
    }
) {
    // Only supported by WP >= 5.3.
    if (!select('core/block-editor').getSelectedBlockClientIds) {
        return null
    }

    return (
        <Fragment>
            <PluginBlockSettingsMenuItem
                icon={StarterblocksIcon}
                label={__('Share Block', 'starterblocks')}
                onClick={onShareBlock}
            />
            <PluginBlockSettingsMenuItem
                icon={StarterblocksIcon}
                label={__('Export as JSON Object', 'starterblocks')}
                onClick={onExportBlockJSON}
            />
            {/*<PluginBlockSettingsMenuItem*/}
            {/*    icon={StarterblocksIcon}*/}
            {/*    label={__('Export as HTML', 'starterblocks')}*/}
            {/*    onClick={onExportBlockHTML}*/}
            {/*/>*/}
            {/*<PluginBlockSettingsMenuItem*/}
            {/*    icon={StarterblocksIcon}*/}
            {/*    label={__('Export as Reusable Block', 'starterblocks')}*/}
            {/*    onClick={onExportBlockReusable}*/}
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
            onShareBlock() {
                if (!blocksSelection.length) {
                    return
                }
                console.log(blocksSelection);
                console.log('share');

                onToggle()
            },
            onExportBlockJSON() {
                if (!blocksSelection.length) {
                    return
                }

                let blocks = wp.data.select("core/block-editor").getBlocks();
                let fileName = 'blocks.json'
                if (blocksSelection.length == 1) {
                    fileName = blocksSelection[0].name.replace('/', '_') + '.json'
                }

                saveData(blocksSelection, fileName, 'json');

                onToggle()
            },
            onExportBlockHTML() {
                if (!blocksSelection.length) {
                    return
                }

                console.log(blocksSelection);
                console.log('export HTML');

                onToggle()
            },
            onExportBlockReusable() {
                if (!blocksSelection.length) {
                    return
                }

                console.log(blocksSelection);
                console.log('export HTML');

                onToggle()
            },
        }
    }),
])(ShareBlockButton)
