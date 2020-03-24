import {useContext, useEffect, useState} from '@wordpress/element';
import TemplateModalContext from '../../contexts/TemplateModalContext';
import PreviewImport from '../preview-import';
import DependentPlugins from '../dependent-plugins';
import './style.scss'

export default function ButtonGroup (props) {
    const {spinner} = useContext(TemplateModalContext);
    const [rootClassName, setRootClassName] = useState('starterblocks-import-button-group');

    // When some action is in progress, disable the button groups
    useEffect(() => {
        if (spinner === null && rootClassName !== 'starterblocks-import-button-group')
            setRootClassName('starterblocks-import-button-group')
        if (spinner !== null && rootClassName === 'starterblocks-import-button-group')
            setRootClassName('starterblocks-import-button-group disabled');
    }, [spinner])

    return (
        <div className={rootClassName}>
            <PreviewImport />
            <DependentPlugins />
        </div>
    )
}
