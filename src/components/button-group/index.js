const {compose} = wp.compose;
const {withDispatch, withSelect, select} = wp.data;
import {useContext, useEffect, useState} from '@wordpress/element';
import PreviewImport from '../preview-import';
import DependentPlugins from '../dependent-plugins';
import './style.scss'

function ButtonGroup (props) {
    const {importingTemplate} = props;
    const [rootClassName, setRootClassName] = useState('starterblocks-import-button-group');

    // When some action is in progress, disable the button groups
    useEffect(() => {
        if (importingTemplate === null && rootClassName !== 'starterblocks-import-button-group')
            setRootClassName('starterblocks-import-button-group')
        if (importingTemplate !== null && rootClassName === 'starterblocks-import-button-group')
            setRootClassName('starterblocks-import-button-group disabled');
    }, [importingTemplate])

    return (
        <div className={rootClassName} data-tut="main_body">
            <PreviewImport />
            <DependentPlugins />
        </div>
    )
}



export default compose([
    withDispatch((dispatch) => {
        return {};
    }),
    withSelect((select, props) => {
        const {getImportingTemplate} = select('starterblocks/sectionslist');
        return {importingTemplate: getImportingTemplate()};
    })
])(PreviewImport);
