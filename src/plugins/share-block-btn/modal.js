const {compose} = wp.compose;
const {withDispatch, withSelect, select} = wp.data;
const {useState, useEffect} = wp.element;
const {apiFetch} = wp;
const {parse} = wp.blocks;
import CreatableSelect from 'react-select/creatable';
import {BlockPreview} from '@wordpress/block-editor';
import {Modal, ModalManager} from '../../modal-manager'
import uniq from 'lodash/uniq';
import {installedBlocksTypes} from '~starterblocks/stores/actionHelper';
import './style.scss'


export default function ShareModal(props) {
    const {blocksSelection, type} = props;
    const [blockTitle, setBlockTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(false);

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
    ];

    const handleChange = (newValue, actionMeta) => {
        console.group('Value Changed');
        console.log(newValue);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
    };

    const shareThisBlock = () => {
        apiFetch({
            path: 'starterblocks/v1/share/',
            method: 'POST',
            headers: {'Registed-Blocks': installedBlocksTypes()},
            data: {
                'postID': select('core/editor').getCurrentPostId(),
                'editor_blocks': blocksSelection,
                'title': blockTitle,
                'description': description,
                'type': type,
                'categories': categories
            }
        }).then(data => {
            setLoading(false);
            if (data.success) {
                alert('Successfully shared your block!');
            } else {
                alert('An unexpected error occured');
            }
            ModalManager.close();
        }).catch(err => {
            setLoading(false);
            alert('There was an error: ' + err);
            ModalManager.close();
        });
    }

    return (
        <Modal compactMode={true}>
            <div className="starterblocks-share">
                <div className="input-panel">

                    <div className="field">
                        <label>Category</label>
                        <CreatableSelect
                            isMulti
                            onChange={handleChange}
                            options={options}
                        />
                    </div>
                    <div className="field">
                        <label>Block Title</label>
                        <input type="text" value={blockTitle} onClick={setBlockTitle} />
                    </div>
                    <div className="field">
                        <label>Description</label>
                        <input type="text" value={description} onClick={setDescription} />
                    </div>
                </div>
                <div className="preview-panel">
                    <BlockPreview blocks={blocksSelection} />
                </div>
                <button className="button button-primary" onClick={shareThisBlock}>
                    {loading ? <i className="fas fa-spinner fa-pulse"/> : <i className="fas fa-share"></i>}
                    Share this block
                </button>
            </div>
        </Modal>
    );
}
