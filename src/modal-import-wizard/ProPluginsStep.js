const {apiFetch} = wp;
const {Component, Fragment, useState} = wp.element;
const {__} = wp.i18n;

import dependencyHelper from './dependencyHelper';

export default function InstallPluginStep(props) {
	const {missingPros, onCloseWizard} = props;

	return (
		<Fragment>
			<div className="starterblocks-import-wizard-body">
				<h5>{__('External Dependencies Required')}</h5>
				<p>{__('The following premium plugin(s) are required to import this template:')}</p>
				<ul className="starterblocks-import-wizard-missing-dependency">
					{
						missingPros.map(pluginKey => {
							const {name, url} = dependencyHelper.pluginInfo(pluginKey);
							return (
								<li>
									{name}&nbsp;&nbsp;
									<a href={url} className={'button button-primary button-small'} target="_blank">Learn
										More <i
											className="fa fa-external-link-alt"></i></a>
								</li>);
						})
					}
				</ul>
			</div>
			<div className="starterblocks-import-wizard-footer">
				<a className="button button-secondary" onClick={onCloseWizard}>
					{__('Close')}
				</a>
			</div>
		</Fragment>
	);
}
