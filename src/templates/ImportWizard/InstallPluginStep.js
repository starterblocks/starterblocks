const {apiFetch} = wp;
const {Component, Fragment, useState} = wp.element;
const {__} = wp.i18n;

import {ModalManager} from '../ModalManager';
import dependencyHelper from './dependencyHelper';

export default function InstallPluginStep(props) {

	const {missingPlugins, toNextStep, onCloseWizard} = props;
	const [installedCount, setInstalledCount] = useState(-1);
	const onInstallPlugins = () => {
		missingPlugins.forEach(pluginKey => {
			const {slug} = dependencyHelper.pluginInfo(pluginKey);
			apiFetch({
				path: 'starterblocks/v1/plugin-install?slug=' + slug
			}).then(res => {
				setInstalledCount(installedCount => installedCount + 1);
			})
		});
	}
	if (installedCount === missingPlugins.length)
		toNextStep();
	return (
		<Fragment>
			<div className="starterblocks-wizard-body">
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
			<div className="starterblocks-wizard-footer">
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
