import {__} from '@wordpress/i18n';
import {useContext} from '@wordpress/element';
import SingleItemContext from '../../contexts/SingleItemContext';
import TemplateModalContext from '../../contexts/TemplateModalContext';
import './style.scss'
export default function PreviewImport (props) {
    const {data, index, pageData} = useContext(SingleItemContext);
    const {openSitePreviewModal, onImportTemplate, spinner} = useContext(TemplateModalContext);
    const triggerImportTemplate = (data) => {
        if (spinner === null) onImportTemplate(data);
    }

    return (
        <div className="action-buttons">
            <a className="starterblocks-button preview-button" target="_blank"
                onClick={() => openSitePreviewModal(index, pageData)}>
                <i className="fa fa-share"/> {__('Preview')}
            </a>


            <a className="starterblocks-button download-button"
                onClick={() => triggerImportTemplate(data)}>
                {spinner === data.ID ? <i className="fas fa-spinner fa-pulse"/> :
                    <i className="fas fa-download"/>}{__('Import')}
            </a>
        </div>
    );
}
