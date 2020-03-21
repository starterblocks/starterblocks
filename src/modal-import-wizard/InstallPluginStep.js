const {apiFetch} = wp;
const {Component, Fragment, useState} = wp.element;
const {withDispatch} = wp.data;
const {__} = wp.i18n;

import {ModalManager} from '../modal-manager';
import dependencyHelper from './dependencyHelper';

function InstallPluginStep(props) {

    const {missingPlugins, toNextStep, onCloseWizard} = props;
    const {setInstalledDependencies} = props;
    const [installingPlugin, setInstallingPlugin] = useState(null);
    const [installedList, setInstalledList] = useState([]);
    const [failedList, setFailedList] = useState([]);
    const [waitingList, setWaitingList] = useState(missingPlugins);

    const preInstallInit = () => {
        setInstalledList([]);
        setFailedList([]);
        setWaitingList(missingPlugins);
        setInstallingPlugin(null);
        setInstalledDependencies(false);
    }

    const onInstallPlugins = async () => {
        preInstallInit();
        let localInstalledList = [];
        let localWaitingList = [...waitingList];
        for (let pluginKey of missingPlugins) {
            const pluginInstance = dependencyHelper.pluginInfo(pluginKey);
            setInstallingPlugin({...pluginInstance, pluginKey});
            localWaitingList = localWaitingList.filter(key => key !== pluginKey )
            setWaitingList(localWaitingList);
            await apiFetch({
                    path: 'starterblocks/v1/plugin-install?slug=' + pluginInstance.slug
                })
                .then(res => {
                    setInstalledDependencies(true);
                    localInstalledList = [...localInstalledList, pluginKey];
                    setInstalledList(localInstalledList);
                    if (localWaitingList.length === 0) setInstallingPlugin(null);
                })
                .catch(res => {
                    setFailedList([...failedList, pluginKey]);
                    if (localWaitingList.length === 0) setInstallingPlugin(null);
                });
        }
    }
    if (waitingList.length === 0 && failedList.length === 0)
        toNextStep();
    return (

        <Fragment>
            <div className="starterblocks-import-wizard-body">
                <h5>{__('Install Required Plugins')}</h5>
                <p>{__('Plugins needed to import this template are missing. Required plugins will be installed and activated automatically.')}</p>

                <ul className="starterblocks-import-progress">
                    {
                        /* Failed install */
                        failedList.map(pluginKey => {
                            const {name} = dependencyHelper.pluginInfo(pluginKey);
                            return (<li className="failure" key={pluginKey}>{name}<i className="fas fa-exclamation-triangle"></i></li>);
                        })
                    }
                    {
                        /* Currently Installing */
                        installingPlugin &&
                            (<li className="installing" key={installingPlugin.pluginKey}>{installingPlugin.name}<i className="fas fa-spinner fa-pulse"></i></li>)
                    }
                    {
                        /* Waiting to Install */
                        waitingList.map(pluginKey => {
                            const {name} = dependencyHelper.pluginInfo(pluginKey);
                            return (<li className="todo" key={pluginKey}>{name}<i className="far fa-square"></i></li>);
                        })
                    }
                    {
                        /* Success */
                        installedList.map(pluginKey => {
                            const {name} = dependencyHelper.pluginInfo(pluginKey);
                            return (<li className="success" key={pluginKey}>{name}<i className="fas fa-check-square"></i></li>);
                        })
                    }
                </ul>
            </div>
            <div className="starterblocks-import-wizard-footer">
                { waitingList.length !== 0 &&
                    <button className="button button-primary" disabled={installingPlugin !== null} onClick={() => onInstallPlugins()}>
                        {installingPlugin !== null && <i className="fas fa-spinner fa-pulse"/>}
                        <span>{__('Install')}</span>
                    </button>
                }
                <button className="button button-secondary" disabled={installingPlugin !== null} onClick={onCloseWizard}>
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
