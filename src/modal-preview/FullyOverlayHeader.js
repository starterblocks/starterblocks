const {Component} = wp.element
const {__} = wp.i18n

function FullyOverlayHeader(props) {
    const {onCloseCustomizer, onNextBlock, onPrevBlock, onImport, pro} = props;
    return (
        <div className="wp-full-overlay-header">
            <button className="close-full-overlay" onClick={onCloseCustomizer}>
                <span className="screen-reader-text">{__('Close', starterblocks.i18n)}</span>
            </button>
            <button className="previous-theme" onClick={onPrevBlock}>
                <span className="screen-reader-text">{__('Previous', starterblocks.i18n)}</span>
            </button>
            <button className="next-theme" onClick={onNextBlock}>
                <span className="screen-reader-text">{__('Next', starterblocks.i18n)}</span>
            </button>
            {
                pro === false &&
                <a className="button hide-if-no-customize button-primary starter-section-import" onClick={onImport}
                data-import="disabled">
                    {__('Import', starterblocks.i18n)}
                </a>
            }
        </div>
    );
}

export default FullyOverlayHeader;
