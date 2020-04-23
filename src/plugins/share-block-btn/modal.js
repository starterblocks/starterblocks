const {compose} = wp.compose;
const {withDispatch, withSelect, select} = wp.data;
const {useState, useEffect} = wp.element;
const {apiFetch} = wp;
import {Modal, ModalManager} from '../../modal-manager'
import uniq from 'lodash/uniq';
import {installedBlocksTypes} from '~starterblocks/stores/actionHelper';
import './style.scss'


export default function ShareModal(props) {
    const {blocksSelection} = props;
    const [blockTitle, setBlockTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const shareThisBlock = () => {
        apiFetch({
            path: 'starterblocks/v1/share/',
            method: 'POST',
            headers: {'Registed-Blocks': installedBlocksTypes()},
            data: {
                'editor_blocks': blocksSelection,
                'section': true,
                'title': blockTitle,
                'registered_blocks': installedBlocksTypes(),
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
                <label>Block Title</label>
                <input type="text" />
                <button className="button button-primary" onClick={shareThisBlock}>
                    {loading ? <i className="fas fa-spinner fa-pulse"/> : <i className="fas fa-share"></i>}
                    Share this block
                </button>
            </div>
        </Modal>
    );
}

/*
export default compose([
    withDispatch((dispatch) => {
        const {
            setLoading,
            setLibrary,
            setImportingTemplate
        } = dispatch('starterblocks/sectionslist');

        return {};
    }),

    withSelect((select, props) => {
        const {} = select('starterblocks/sectionslist');
        return {
        };
    })
])(ShareModal);
*/
