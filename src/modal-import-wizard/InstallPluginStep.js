const {apiFetch} = wp;
const {Component, Fragment, useState} = wp.element;
const {withDispatch} = wp.data;
const {__} = wp.i18n;

import {ModalManager} from '../modal-manager';
import dependencyHelper from './dependencyHelper';

function InstallPluginStep(props) {

    const {missingPlugins, toNextStep, onCloseWizard} = props;
    const {setInstalledDependencies} = props;
    const [installedCount, setInstalledCount] = useState(-1);
    const onInstallPlugins = () => {
        setInstalledDependencies(false);
        missingPlugins.forEach(pluginKey => {
            const {slug} = dependencyHelper.pluginInfo(pluginKey);
            apiFetch({
                path: 'starterblocks/v1/plugin-install?slug=' + slug
            }).then(res => {
                setInstalledDependencies(true);
                setInstalledCount(installedCount => installedCount + 1);
            })
        });
    }
    if (installedCount === missingPlugins.length)
        toNextStep();
    return (

        <Fragment>
            <div className="starterblocks-import-wizard-body">
                <h5>{__('Install Required Plugins')}</h5>
                <p>{__('Plugins needed to import this template are missing. Required plugins will be installed and activated automatically.')}</p>

                <ul class="starterblocks-import-progress">
                    {/* Failed install */}
                    <li className="failure">CoBlocks <i className="fas fa-exclamation-triangle"></i></li>
                    {/* Currently Installing */}
                    <li className="installing">Qubely <i className="fas fa-spinner fa-pulse"></i></li>
                    {/* Todo - Waiting to Install */}
                    <li className="todo">Kioken Blocks <i className="far fa-square"></i></li>
                    {/* Success */}
                    <li className="success">Stackable <i className="fas fa-check-square"></i></li>
                </ul>

                <ul>
                    {
                        // Make sure the plugins are in order
                        missingPlugins.map(pluginKey => {
                            const {name} = dependencyHelper.pluginInfo(pluginKey);
                            return (<li key={pluginKey}>{name}</li>);
                        })
                    }
                </ul>
                {
                    (installedCount >= 0) &&
                    <div className="installCount">
                        {installedCount} / {missingPlugins.length}
                    </div>
                }
            </div>
            <div className="starterblocks-import-wizard-footer">
                <button className="button button-primary" disabled={installedCount >= 0} onClick={() => {
                    setInstalledCount(0);
                    onInstallPlugins()
                }}>
                    {installedCount >= 0 && <i className="fas fa-spinner fa-pulse"/>}
                    <span>{__('Install')}</span>
                </button>
                <button className="button button-secondary" disabled={installedCount >= 0} onClick={onCloseWizard}>
                    {__('Cancel')}
                </button>
            </div>
        </Fragment>
    );
}


export default withDispatch((dispatch) => {
    const {
        setInstalledDependencies
    } = dispatch('starterblocks/sectionslist');

    return {
        setInstalledDependencies
    };
})
(InstallPluginStep);
