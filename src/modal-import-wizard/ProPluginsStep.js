const {Component, Fragment, useState} = wp.element;
const {withSelect, select} = wp.data;
const {__} = wp.i18n;
import {pluginInfo} from '~starterblocks/stores/dependencyHelper';

function ProPluginStep(props) {
    const {missingPros, onCloseWizard} = props;
    const {plugins} = props;
    return (
        <Fragment>
            <div className="starterblocks-import-wizard-body">
                <h5>{__('External Dependencies Required')}</h5>
                <p>{__('The following premium plugin(s) are required to import this template:')}</p>

                <ul className="starterblocks-import-progress">
                    {
                        missingPros.map(pluginKey => {
                            let plugin = pluginInfo(pluginKey)
                            return (
                                <li className='installing' key={pluginKey}>
                                    {plugin.name} {plugin.url &&
                                <a href={plugin.url} target="_blank"><i className="fa fa-external-link-alt"/></a>
                                }
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

export default withSelect((select, props) => {
    const {getPlugins} = select('starterblocks/sectionslist');
    return {plugins: getPlugins()};
})(ProPluginStep);
