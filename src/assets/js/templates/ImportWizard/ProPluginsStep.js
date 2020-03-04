const {apiFetch} = wp;
const {Component, Fragment, useState} = wp.element;
const {__} = wp.i18n;

import {ModalManager} from '../ModalManager';
import dependencyHelper from "./dependencyHelper";
export default function InstallPluginStep(props) {
    const {proPlugins} = props;

    return (
        <Fragment>
            <div class="starterblocks-wizard-body">
                <h5>{__('Activate Pro Plugins')}</h5>
                <p>{__('Plugins needed to import this template are missing. The pro should be purchased for those plugins.')}</p>
                <ul>
                    {
                        proPlugins.map(pluginKey => {
                            const {name, url} = dependencyHelper.pluginInfo(pluginKey);
                            return (
                            <li>
                                {name}
                                <a href={url}>Get Pro</a>
                            </li>);
                        })
                    }
                </ul>
            </div>
            <div class="starterblocks-wizard-footer">
                <a class="button button-secondary" onClick={e => ModalManager.closeWizard()}>
                    {__('Cancel')}
                </a>
            </div>
        </Fragment>
    );
}