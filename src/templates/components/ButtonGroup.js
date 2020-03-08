const {__} = wp.i18n
const {Component, Fragment, useContext, useEffect, useState} = wp.element;
import SingleItemContext from '../contexts/SingleItemContext';
import TemplateModalContext from '../contexts/TemplateModalContext';
import {missingPro, missingRequirement} from '../stores/helper';

export default function ButtonGroup(props) {
    const {data, activeItemType, index, pageData} = useContext(SingleItemContext);
    const {openSitePreviewModal, onImportTemplate, spinner} = useContext(TemplateModalContext);
    const [rootClassName, setRootClassName] = useState('starterblocks-import-button-group');
    
    const {ID, image, url, pro, requirements} = data;

    useEffect(() => {
        if (spinner === null && rootClassName !== 'starterblocks-import-button-group')
            setRootClassName('starterblocks-import-button-group')
        if (spinner !== null && rootClassName === 'starterblocks-import-button-group')
            setRootClassName('starterblocks-import-button-group disabled');

    }, [spinner])

    const triggerImportTemplate = (data) => {
        if (spinner === null) onImportTemplate(data);
    }

    const isMissingRequirement = missingRequirement(pro, requirements);
    const isMissingPro = missingPro(pro);

    return (
        <div className={rootClassName}>
            <Fragment>
                {url &&
                <a className="starterblocks-button" target="_blank"
                    onClick={() => openSitePreviewModal(index, pageData)}>
                    <i className="fa fa-share"/> {__('Preview')}
                </a>
                }
                <a className="starterblocks-button starterblocks-button-download"
                    onClick={() => triggerImportTemplate(data)}>
                    {spinner === ID ? <i className="fas fa-spinner fa-pulse"/> :
                        <i className="fas fa-download"/>}{__('Import')}
                </a>
            </Fragment>
        </div>
    )
}
