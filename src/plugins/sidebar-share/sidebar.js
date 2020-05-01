const {apiFetch} = wp;
const {__} = wp.i18n;
const {Component, Fragment, useState} = wp.element;
const {compose} = wp.compose;
const {PanelBody, Spinner} = wp.components
const {withDispatch, select} = wp.data;
const {PluginSidebar, PluginSidebarMoreMenuItem} = wp.editPost;
import {installedBlocksTypes} from '~starterblocks/stores/actionHelper';
import {Modal, ModalManager} from '../../modal-manager'
import ShareModal from '../share-block-btn/modal'

function Sidebar(props) {

    const {savePost} = props;
    const [loading, setLoading] = useState(false);

    const onShare = () => {
        ModalManager.open(<ShareModal type='page' />);
    }

    return (
        <Fragment>
            <PluginSidebarMoreMenuItem target="starterblocks-share">
                {__('StarterBlocks Template', starterblocks.i18n)}
            </PluginSidebarMoreMenuItem>
            <PluginSidebar name="starterblocks-share" title={__('StarterBlocks Shares', starterblocks.i18n)}>
                <PanelBody title={__('Share this Design', starterblocks.i18n)} initialOpen={true}>
                    <div className="d-flex justify-content-center">
                        <a className="button button-primary" onClick={onShare}>
                            {loading ? <i className="fas fa-spinner fa-pulse"/> : <i className="fas fa-share"></i>}
                            &nbsp;{__('Share this design', starterblocks.i18n)}
                        </a>
                    </div>
                </PanelBody>
            </PluginSidebar>
        </Fragment>
    );
}

export default compose([
    withDispatch((dispatch, ownProps) => {
        const {savePost} = dispatch('core/editor');
        return {savePost};
    })
])(Sidebar)
