const { Component } = wp.element

function FullyOverlayHeader(props) {
    const {onCloseCustomizer, onNextBlock, onPrevBlock, onImport, pro} = props;
    return (
        <div class="wp-full-overlay-header">
            <button class="close-full-overlay" onClick={onCloseCustomizer}>
                <span class="screen-reader-text">Close</span>
            </button>
            <button class="previous-theme" onClick={onPrevBlock}>
                <span class="screen-reader-text">Previous</span>
            </button>
            <button class="next-theme" onClick={onNextBlock}>
                <span class="screen-reader-text">Next</span>
            </button>
            { (starterblocks_admin.mokama || pro == false) &&
                <a class="button hide-if-no-customize button-primary starter-section-import" onClick={onImport} data-import="disabled">
                    Import
                </a>
            }
        </div>
    );
}

export default FullyOverlayHeader;