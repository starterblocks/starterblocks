import {__} from '@wordpress/i18n';
const {compose} = wp.compose;
const {withDispatch, withSelect, select} = wp.data;
import {useContext} from '@wordpress/element';
import SingleItemContext from '../../contexts/SingleItemContext';
import './style.scss'
function PreviewImport (props) {
    const {data, index, pageData} = useContext(SingleItemContext);
    const {setImportingTemplate} = props;
    let spinner = null;
    const triggerImportTemplate = (data) => {
        if (spinner === null) {
            spinner = data.ID;
            setImportingTemplate(data);
        }
    }

    return (
        <div className="action-buttons">
            <a className="starterblocks-button preview-button" target="_blank">
                {/*onClick={() => openSitePreviewModal(index, pageData)} */}
                <i className="fa fa-share"/> {__('Preview')}
            </a>


            <a className="starterblocks-button download-button"
                onClick={() => triggerImportTemplate(data)}>
                <i className="fas fa-download"/>}{__('Import')}
            </a>
        </div>
    );
}


export default compose([
    withDispatch((dispatch) => {
        const {
            setImportingTemplate
        } = dispatch('starterblocks/sectionslist');

        return {
            setImportingTemplate
        };
    }),

    withSelect((select, props) => {
        return {};
    })
])(PreviewImport);
