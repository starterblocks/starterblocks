const {Component, useState, useEffect} = wp.element
const {__} = wp.i18n
const {Tooltip} = wp.components;

import * as Icons from '~starterblocks/icons'
import findIndex from 'lodash/findIndex';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import filter from 'lodash/filter';
import dependencyHelper from '../modal-import-wizard/dependencyHelper';

function SidebarContent(props) {
    const {itemData, pro} = props;
    const {name, image, blocks} = itemData;
    const [installList, setInstallList] = useState([]);
    const [proList, setProList] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        collectMissingRequirements(); // This methods is different from the others, it updates the source of
    }, [itemData]);

    const collectMissingRequirements = () => {
        const dependencies = dependencyHelper.checkTemplateDependencies(itemData);
        let missingPlugins = filter(uniq(dependencies.missingPluginArray).map(plugin => {
            return starterblocks.supported_plugins[plugin] ? {
                ...starterblocks.supported_plugins[plugin],
                keyName: plugin
            } : null;
        }));
        let missingPro = filter(uniq(dependencies.missingProArray).map(plugin => {
            return starterblocks.supported_plugins[plugin] ? {
                ...starterblocks.supported_plugins[plugin],
                keyName: plugin
            } : null;
        }));
        setInstallList(missingPlugins);
        setProList(missingPro);
    }

    return (
        <div className="wp-full-overlay-sidebar-content">
            <div className="install-theme-info">
                <h3 className="theme-name">{name}</h3>
                <div className="theme-screenshot-wrap">
                    <img className="theme-screenshot" src={image} alt=""/>{pro ?
                    <span className="starterblocks-pro-badge">{__('Premium')}</span> : ''
                }</div>
                { blocks &&
                    <div className="starterblocks-dependencies-list">
                        <h4>Required Plugins</h4>
                        {
                            blocks && Object.keys(blocks).map((keyName, i) => {
                                if (!starterblocks.supported_plugins[keyName]) return null;
                                const {name, url, version} = starterblocks.supported_plugins[keyName];
                                const IconComponent = Icons[keyName];
                                return (
                                    <div key={i}>
                                        <p className="starterblocks-dependency-blocks">
                                            {
                                                IconComponent &&
                                                (
                                                    <a href={url} target="_blank"
                                                       className={!version ? 'missing-dependency' : ''}>
                                                        <IconComponent/>
                                                    </a>
                                                )
                                            }
                                            <span className="starterblocks-dependency-name">{name}</span>

                                            {blocks &&
                                                <ul>
                                                    { sortBy(blocks[keyName]).map(function (item, index) {
                                                        return <li key={index}>{(index ? ', ' : '') + item}</li>;
                                                    })
                                                    }
                                                </ul>
                                            }


                                        </p>
                                    </div>
                                )
                            })
                        }
                    </div>
                }

                <div className="requirements-list">
                    <div className="list-type">
                        {
                            installList.length > 0 &&
                            <div>
                                <h4>Missing Plugins</h4>
                                <ul>
                                    {
                                        installList.map(install => {
                                            const {name, url, version, keyName} = install;
                                            const IconComponent = Icons[keyName];
                                            return (
                                                <li key={keyName}>
                                                    <a href={url} target="_blank" className="missing">
                                                        {IconComponent && <IconComponent/>}
                                                        <span className="starterblocks-dependency-name">{name}</span>
                                                    </a>
                                                </li>);
                                        })
                                    }
                                </ul>
                            </div>
                        }
                        {
                            proList.length > 0 &&
                            <div>
                                <h4>Require to be pro</h4>
                                <ul>
                                    {
                                        proList.map(pro => {
                                            const {name, url, version, keyName} = pro;
                                            const IconComponent = Icons[keyName];
                                            return (
                                                <li key={keyName}>
                                                    <a href={url} target="_blank" className="missing">
                                                        {IconComponent && <IconComponent/>}
                                                        <span className="starterblocks-dependency-name">{name}</span>
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

export default SidebarContent;
