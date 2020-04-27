const {compose} = wp.compose;
const {withDispatch, withSelect, select} = wp.data;
const {useState, useEffect} = wp.element;
const {apiFetch} = wp;
const {parse} = wp.blocks;
import CreatableSelect from 'react-select/creatable';
import {BlockPreview} from '@wordpress/block-editor';
import {Modal, ModalManager} from '../../modal-manager'
import uniq from 'lodash/uniq';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import {installedBlocksTypes} from '~starterblocks/stores/actionHelper';
import {setWithExpiry, getWithExpiry} from '../../stores/helper';
import './style.scss'


const customStyles = {
    container: (provided, state) => ({
        ...provided,
        width: 300
    }),
    menu: (provided, state) => ({
        ...provided,
        marginTop: 0
    }),
    menuList: (provided, state) => ({
        ...provided,
        height: 180
    }),
    control: (provided, state) => ({
        ...provided,
        minHeight: 30
    })
}

export default function ShareModal(props) {
    const {blocksSelection, type} = props;
    const [blockTitle, setBlockTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const keyName = type === 'page' ? 'page_categories_list' : 'section_categories_list';
        const options = sortBy(getWithExpiry(keyName), 'label');
        setOptions(options);
    }, [type]);

    const handleChange = (newValue, actionMeta) => {
        setCategory(map(newValue, 'value'));
    };

    const shareThisBlock = () => {
        if (loading) return;
        setLoading(true);
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
                'categories': category
            }
        }).then(data => {
            setLoading(false);
            if (data.success) {
                alert('Successfully shared your block!');
                window.open(data.data.url, '_blank');
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
                <div className="panel">
                    <div className="input-panel">
                        <div className="field">
                            <label>Category</label>
                            <CreatableSelect
                                isMulti
                                onChange={handleChange}
                                options={options}
                                width='200px'
                                styles={customStyles}
                            />
                        </div>
                        <div className="field">
                            <label>Block Title</label>
                            <input type="text" value={blockTitle} onChange={(e) => setBlockTitle(e.target.value)} />
                        </div>
                        <div className="field">
                            <label>Description</label>
                            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                    </div>
                    <div className="preview-panel">
                        <BlockPreview blocks={blocksSelection} />
                    </div>
                </div>
                <button className="button button-primary" onClick={shareThisBlock}>
                    {loading ? <i className="fas fa-spinner fa-pulse"/> : <i className="fas fa-share"></i>}
                    Share this block
                </button>
            </div>
        </Modal>
    );
}
