const { Component } = wp.element

function FullyOverlayFooter(props) {
    const { previewClass, expandedClass, pro } = props;
    const { onChangePreviewClass, onToggleExpanded, onImport } = props;
    const previewClassesList = [
        {className: "preview-desktop", screenReaderText: "Enter desktop preview mode"},
        {className: "preview-tablet", screenReaderText: "Enter tablet preview mode"},
        {className: "preview-mobile", screenReaderText: "Enter mobile preview mode"}
    ];

    const toggleExpanded = () => {
        let nextStatus = (expandedClass === "collapsed") ? "expanded" : "collapsed";
        onToggleExpanded(nextStatus);
    }
    return (
        <div class="wp-full-overlay-footer">
            <div class="footer-import-button-wrap starterblocks-import-button-group">
                {
                (!starterblocks_admin.mokama && pro == true) ?
                    <a class="starterblocks-button-download" target="_blank" href="http://starterblocks.io/">
                        <i class="fas fa-upload"></i>&nbsp;Upgrade to Pro
                    </a>
                    :
                    <a class="button button-hero hide-if-no-customize button-primary starterblocks-import" onClick={onImport}>
                        <i class="fas fa-download"></i>&nbsp;Import						
                    </a>
                }
            </div>
            <button type="button" class="collapse-sidebar button" onClick={toggleExpanded} aria-expanded="true" aria-label="Collapse Sidebar">
                <span class="collapse-sidebar-arrow"></span>
                <span class="collapse-sidebar-label">Collapse</span>
            </button>

            <div class="devices-wrapper">
                <div class="devices">
                    {
                        previewClassesList.map((previewObject) => {
                            return (
                                <button type="button" class={previewClass === previewObject.className ? previewObject.className + " active" : previewObject.className}
                                    aria-pressed="true" onClick={()=> onChangePreviewClass(previewObject.className)}>
                                    <span class="screen-reader-text">{previewObject.screenReaderText}</span>
                                </button>
                            );
                        })
                    }
                </div>
            </div>

        </div>
    );
}

export default FullyOverlayFooter;