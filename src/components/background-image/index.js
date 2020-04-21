const {apiFetch} = wp;
const {Component, useState} = wp.element;
const {compose} = wp.compose;
const {withDispatch, withSelect, select} = wp.data;
const {parse} = wp.blocks;

import {BlockPreview} from '@wordpress/block-editor';
import {installedBlocksTypes} from '~starterblocks/stores/actionHelper';
function BackgroundImage(props) {
    const {data, discardAllErrorMessages, appendErrorMessage, insertBlocks, activeItemType} = props;
    const [dataLoaded, setDataLoaded] = useState(false);
    const [blocks, setBlocks] = useState(null);

    if (data && dataLoaded === false) {
        const type = activeItemType === 'section' ? 'sections' : 'pages';
        let the_url = 'starterblocks/v1/template?type=' + type + '&id=' + data.id;
        if ('source' in data) {
            the_url += '&source=' + data.source;
        }

        const options = {
            method: 'GET',
            path: the_url,
            headers: {'Content-Type': 'application/json', 'Registered-Blocks': installedBlocksTypes()}
        };

        apiFetch(options).then(response => {
            if (response.success) {
                setBlocks(response.data);
            } else {
                appendErrorMessage(response.data.error);
            }
            setDataLoaded(true);
        }).catch(error => {
            appendErrorMessage(error.code + ' : ' + error.message);
            setDataLoaded(true);
        });
    }

    if (dataLoaded === true) {
        let parsed = parse(blocks.template);
        insertBlocks(parsed);
        //return <BlockPreview blocks={parsed} />;
    }
    return null;
}

export default compose([
    withDispatch((dispatch) => {
        const {
            insertBlocks
        } = dispatch('core/block-editor');
        const {
            appendErrorMessage,
            discardAllErrorMessages
        } = dispatch('starterblocks/sectionslist');

        return {
            appendErrorMessage,
            discardAllErrorMessages,
            insertBlocks
        };
    }),
    withSelect((select, props) => {
        const {getActiveItemType} = select('starterblocks/sectionslist');
        return {
            activeItemType: getActiveItemType()
        };
    })
])(BackgroundImage);
