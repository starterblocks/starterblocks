const {Component, useState, useEffect} = wp.element
const {__} = wp.i18n
const {Tooltip} = wp.components;
const {withSelect, select} = wp.data;

import * as Icons from '~starterblocks/icons'
import findIndex from 'lodash/findIndex';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import filter from 'lodash/filter';
import copy from 'clipboard-copy';
import {requiresInstall, requiresPro} from '~starterblocks/stores/dependencyHelper'

function SidebarContent(props) {
    const {plugins} = props;
    const {itemData, pro} = props;
    const {hash, name, image, blocks, proDependencies, installDependencies} = itemData;
    const [copied, setCopied] = useState(false);

    const copyHash = () => {
        copy(hash.substring(0, 7));
        setCopied(true);
        setTimeout(function () {
            setCopied(false);
        }, 3500);
    }

    useEffect(() => {
        setCopied(false);
    }, [itemData]);

    return (
        <div className="wp-full-overlay-sidebar-content">
            <div className="install-theme-info">
                <h3 className="theme-name">{name}</h3>
                <div className="theme-screenshot-wrap">
                    <img className="theme-screenshot"
                         src={image ? image : starterblocks.plugin + 'assets/img/starterblocks-medium.jpg'} alt=""/>{pro ?
                    <span className="starterblocks-pro-badge">{__('Premium')}</span> : ''
                }</div>

                <h5 className="theme-hash">
                    <div className="button-container">
                        <span className="button button-secondary the-copy" onClick={copyHash} title="Copy Identifier"><i
                            className="fa fa-copy" aria-hidden="true"></i></span>
                        <span className="button button-secondary the-hash"
                              title="Identifier">{hash.substring(0, 7)}</span>
                        {copied && <span className="copied hideMe"><br/>copied</span>}
                    </div>

                </h5>

                <div className="requirements-list">
                    <div className="list-type">
                        {
                            requiresInstall(itemData) &&
                            <div>
                                <h4>Missing Plugins</h4>
                                <ul>
                                    {
                                        installDependencies.map(pluginKey => {
                                            const pluginInstance = plugins[pluginKey];
                                            if (!pluginInstance) return null;
                                            const IconComponent = Icons[pluginKey];
                                            return (
                                                <li key={pluginKey}>
                                                    <a href={pluginInstance.url ? pluginInstance.url : ''}
                                                       target="_blank" className="missing">
                                                        {IconComponent && <IconComponent/>}
                                                        <span
                                                            className="starterblocks-dependency-name">{pluginInstance.name}</span>
                                                    </a>
                                                </li>);
                                        })
                                    }
                                </ul>
                            </div>
                        }
                        {
                            requiresPro(itemData) &&
                            <div>
                                <h4>Require to be pro</h4>
                                <ul>
                                    {
                                        proDependencies.map(pluginKey => {
                                            const pluginInstance = plugins[pluginKey];
                                            if (!pluginInstance) return null;
                                            const IconComponent = Icons[pluginKey];
                                            return (
                                                <li key={pluginKey}>
                                                    <a href={pluginInstance.url ? pluginInstance.url : ''}
                                                       target="_blank" className="missing">
                                                        {IconComponent && <IconComponent/>}
                                                        <span
                                                            className="starterblocks-dependency-name">{pluginInstance.name}</span>
                                                    </a>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}


export default withSelect((select, props) => {
    const {getPlugins} = select('starterblocks/sectionslist');
    return {plugins: getPlugins()};
})(SidebarContent);
