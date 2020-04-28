const {Component, Fragment, useState} = wp.element;
const {withSelect, select} = wp.data;
const {__} = wp.i18n;

import StarterBlocksPremiumBox from './StarterBlocksPremiumBox';
import {pluginInfo} from '~starterblocks/stores/dependencyHelper';


const STARTERBLOCKS_PRO_KEY = 'starterblocks-pro';
function ProPluginStep(props) {
    const {missingPros, onCloseWizard} = props;
    const {plugins} = props;

    return (
        <Fragment>
            <div className="starterblocks-modal-body">
                <h5>{__('External Dependencies Required')}</h5>
                <p>{__('The following premium plugin(s) are required to import this template:')}</p>
                {
                    (missingPros.indexOf(STARTERBLOCKS_PRO_KEY) >= 0 ) ?
                    <StarterBlocksPremiumBox /> :
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
                }
            </div>
            <div className="starterblocks-modal-footer">
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
