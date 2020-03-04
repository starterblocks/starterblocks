const { compose } = wp.compose;
const { withDispatch, withSelect } = wp.data;
const { Component, useState } = wp.element
const { Spinner } = wp.components;
const { apiFetch } = wp;
const { __ } = wp.i18n
import SitePreviewSidebar from './SitePreviewSidebar';
import { ModalManager } from '../ModalManager'
import "./customizer.scss";

function SitePreviewCustomizer(props) {

    const { startIndex, currentPageData } = props;
    const [ currentIndex, setCurrentIndex ] = useState(startIndex);
    const [ previewClass, setPreviewClass ] = useState('preview-desktop')
    const [ expandedClass, toggleExpanded ] = useState('expanded')

    const onCloseCustomizer = () => {
        ModalManager.closeCustomizer();
    }

    const onNextBlock = () => {
        if (currentIndex < currentPageData.length) setCurrentIndex(currentIndex + 1);
    }

    const onPrevBlock = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    }

    let wrapperClassName = ["wp-full-overlay sites-preview theme-install-overlay ", previewClass, expandedClass].join(" ");
    let itemData = currentPageData[currentIndex];
    return (
        <div className={wrapperClassName} style={{display: 'block'}}>
            <SitePreviewSidebar itemData={itemData} previewClass={previewClass} expandedClass={expandedClass}
                onNextBlock={onNextBlock} onPrevBlock={onPrevBlock}
                onCloseCustomizer={onCloseCustomizer} onToggleExpanded={e => toggleExpanded(e)} 
                onChangePreviewClass={e => setPreviewClass(e)} />
            <div className="wp-full-overlay-main">
                <iframe src={itemData.url} target="Preview"></iframe>
            </div>
        </div>
    );
}

export default SitePreviewCustomizer;