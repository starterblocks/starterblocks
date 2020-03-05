const {apiFetch} = wp;
const {Component, Fragment, useState} = wp.element;
const {__} = wp.i18n;

import {ModalManager} from '../ModalManager';
import dependencyHelper from "./dependencyHelper";
export default function InstallPluginStep(props) {

    const {missingPlugins, toNextStep, onCloseWizard} = props;
    const {installedCount, setInstalledCount} = useState(-1);
    const onInstallPlugins = () => {
        setInstalledCount(0);
        missingPlugins.forEach(pluginKey => {
            const {slug} = dependencyHelper.pluginInfo(pluginKey);
            apiFetch({
                path: 'starterblocks/v1/plugin-install?slug=' + slug
            }).then(() => {
                setInstalledCount(installedCount + 1);
                if (installedCount === missingPlugins.length ) 
                    toNextStep();
            })
        });
    }
    return (
        <Fragment>
            <div class="starterblocks-wizard-body">
                <h5>{__('Install Required Plugins')}</h5>
                <p>{__('Plugins needed to import this template are missing. Required plugins will be installed and activated automatically.')}</p>
                <ul>
                    {
                        missingPlugins.map(pluginKey => {
                            const {name} = dependencyHelper.pluginInfo(pluginKey);
                            return (<li>{name}</li>);
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
            <div class="starterblocks-wizard-footer">
                <a class="button button-primary" onClick={onInstallPlugins}>
                    {__('Install')}
                </a>
                <a class="button button-secondary" onClick={onCloseWizard}>
                    {__('Cancel')}
                </a>
            </div>
        </Fragment>
    );
}