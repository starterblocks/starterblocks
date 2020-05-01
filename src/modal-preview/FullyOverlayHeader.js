const {Component} = wp.element

function FullyOverlayHeader(props) {
    const {onCloseCustomizer, onNextBlock, onPrevBlock, onImport, pro} = props;
    return (
        <div className="wp-full-overlay-header">
            <button className="close-full-overlay" onClick={onCloseCustomizer}>
                <span className="screen-reader-text">{__('Close', 'starterblocks')}</span>
            </button>
            <button className="previous-theme" onClick={onPrevBlock}>
                <span className="screen-reader-text">{__('Previous', 'starterblocks')}</span>
            </button>
            <button className="next-theme" onClick={onNextBlock}>
                <span className="screen-reader-text">{__('Next', 'starterblocks')}</span>
            </button>
            {
                pro === false &&
                <a className="button hide-if-no-customize button-primary starter-section-import" onClick={onImport}
                data-import="disabled">
                    {__('Import', 'starterblocks')}
                </a>
            }
        </div>
    );
}

export default FullyOverlayHeader;
