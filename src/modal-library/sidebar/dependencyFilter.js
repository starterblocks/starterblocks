import React from 'react';

const {Component, Fragment} = wp.element;
const {compose} = wp.compose;
const {select, withDispatch, withSelect} = wp.data;
const {__} = wp.i18n;

import {CheckboxControl, Tooltip} from '@wordpress/components';
import {pluginInfo} from '~starterblocks/stores/dependencyHelper';

function DependencyFilter(props) {
    const {dependencyFilters, loading, plugins} = props;
    const {setDependencyFilters} = props;

    const onChangeCategory = (data) => {
        if (isDisabledCategory(data)) return;
        setActiveCategory(data.slug);
    };
    // Give the selected category(activeCategory) label className as "active"
    const isChecked = (pluginKey) => {
        return dependencyFilters[pluginKey];
    };

    const toggleChecked = (pluginKey) => {
        setDependencyFilters({...dependencyFilters, [pluginKey]: !dependencyFilters[pluginKey]});
    };

    const setAllCheckedAs = (newVal) => {
        setDependencyFilters(
            Object.keys(dependencyFilters)
                .filter(key => key!=='none')
                .reduce((acc, key) => {
                    return {...acc, [key]: newVal}
                }, {none: true})
        );
    };

    return (
        <Fragment>
            {!loading &&
                <div id="starterblock-filter-dependencies" data-tut="tour__filter_dependencies">
                    <h3>{__('Required Plugins', 'starterblocks')}</h3>
                    <div className="starterblocks-select-actions">
                        <a href="#" onClick={() => setAllCheckedAs(true)}>Select All</a>
                        <span>&nbsp; / &nbsp;</span>
                        <a href="#" onClick={() => setAllCheckedAs(false)}>Select None</a>
                    </div>
                    <ul className="starterblocks-sidebar-dependencies">
                        {
                            Object.keys(dependencyFilters).sort().map(pluginKey => {
                                if (pluginKey === 'none') return null;
                                let pluginInstance = pluginInfo(pluginKey)
                                if (pluginInstance.name == null) {
                                    return // Skip extra items
                                }
                                return (
                                    <li className={!pluginInstance.version ? 'missing-dependency' : ''} key={pluginKey}>
                                        <CheckboxControl
                                            label={pluginInstance.name}
                                            checked={isChecked(pluginKey)}
                                            onChange={() => toggleChecked(pluginKey)}
                                        />

                                        {pluginInstance.url ?
                                            <a href={pluginInstance.url} target="_blank">
                                                <i className="fa fa-external-link-alt" />
                                            </a> : null}
                                    </li>
                                );

                            })
                        }
                    </ul>
                </div>
            }
        </Fragment>
    );
}

export default compose([
    withDispatch((dispatch) => {
        const {setDependencyFilters} = dispatch('starterblocks/sectionslist');
        return {
            setDependencyFilters
        };
    }),

    withSelect((select, props) => {
        const {getDependencyFilters, getLoading, getPlugins} = select('starterblocks/sectionslist');
        return {
            loading: getLoading(),
            dependencyFilters: getDependencyFilters(),
            plugins: getPlugins()
        };
    })
])(DependencyFilter);
