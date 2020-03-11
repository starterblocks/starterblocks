const {apiFetch} = wp;
const {__} = wp.i18n;
const {Component, Fragment, useState} = wp.element;
const {compose} = wp.compose;
const {PanelBody, Spinner} = wp.components
const {withDispatch, select} = wp.data;
const {PluginSidebar, PluginSidebarMoreMenuItem} = wp.editPost;


function Sidebar(props) {

	const {savePost} = props;
	const [loading, setLoading] = useState(false);

	const onShare = () => {
		if (loading) return; // prevent duplicate efforts
		setLoading(true);

		savePost().then(() => {
			apiFetch({
				path: 'starterblocks/v1/share/',
				method: 'POST',
				data: {
					'postID': select('core/editor').getCurrentPostId(),
					'template': select('core/editor').getEditedPostContent(),
				}
			}).then(data => {
				setLoading(false);
			}).catch(err => {
				setLoading(false);
				alert('There was an error: ' + err);
			});
		})
	}

	return (
		<Fragment>
			<PluginSidebarMoreMenuItem target="starterblocks-share">
				{__('StarterBlocks Template')}
			</PluginSidebarMoreMenuItem>
			<PluginSidebar name="starterblock-sidebar" title={__('StarterBlocks Shares', starterblocks.i18n)}>
				<PanelBody title={__('Share this post')} initialOpen={true}>
					<div className="d-flex justify-content-center">
						<a className="button button-primary" onClick={onShare}>
							{loading ? <i className="fas fa-spinner fa-pulse"/> : <i className="fas fa-share"></i>}
							&nbsp;{__('Share this design', 'starterblocks.i18n')}
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
