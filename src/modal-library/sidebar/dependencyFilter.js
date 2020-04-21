import React from 'react';

const {Component, Fragment} = wp.element;
const {compose} = wp.compose;
const {select, withDispatch, withSelect} = wp.data;
const {__} = wp.i18n;

import {CheckboxControl, Tooltip} from '@wordpress/components';
import {pluginInfo} from '~starterblocks/stores/dependencyHelper';
import groupBy from 'lodash/groupBy';

function DependencyFilter(props) {
    const {dependencyFilters, loading, plugins} = props;
    const {setDependencyFilters} = props;

    const onChangeCategory = (data) => {
        if (isDisabledCategory(data)) return;
        setActiveCategory(data.slug);
    };
    // Give the selected category(activeCategory) label className as "active"
    const isChecked = (pluginKey) => {
        if (dependencyFilters.hasOwnProperty(pluginKey))
            return dependencyFilters[pluginKey].hasOwnProperty('value') ? dependencyFilters[pluginKey].value : dependencyFilters[pluginKey];
        return false;
    };

    const toggleChecked = (pluginKey) => {
        if (pluginKey === 'none') {
            setDependencyFilters({...dependencyFilters,
                [pluginKey]: { value: dependencyFilters[pluginKey].value === false, disabled: dependencyFilters[pluginKey]['disabled'] === true }});
        } else {
            let newDependencyFilters = {...dependencyFilters,
                [pluginKey]: { value: dependencyFilters[pluginKey].value === false, disabled: dependencyFilters[pluginKey]['disabled'] === true }};

            let valueCount = groupBy(Object.keys(newDependencyFilters), key => (newDependencyFilters[key] === true || newDependencyFilters[key].value === true));

            if (valueCount['true'] && valueCount['true'].length > 0 && valueCount['false'] && valueCount['false'].length > 0) {
                setDependencyFilters({...newDependencyFilters, none: {value: false, disabled: newDependencyFilters['none']['disabled']}});
            } else {
                setDependencyFilters({...newDependencyFilters, none: {value: true, disabled: newDependencyFilters['none']['disabled']}});
            }
        }
    };

    const setAllCheckedAs = (newVal) => {
        setDependencyFilters(
            Object.keys(dependencyFilters)
                .filter(key => key!=='none')
                .reduce((acc, key) => {
                    return {...acc, [key]: {value: newVal, disabled: acc[key]['disabled']}}
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
                        { (loading === false) &&
                            <li>
                                {/*<Tooltip*/}
                                {/*    position='right'*/}
                                {/*    text="These templates only use native WordPress Gutenberg Blocks"*/}
                                {/*>*/}
                                <CheckboxControl
                                    label={__('Native', 'starterblocks')}
                                    checked={isChecked('none')}
                                    disabled={isChecked('none')}
                                    onChange={() => toggleChecked('none')}
                                />
                                <Tooltip text={__('Only default WordPress blocks used.', 'starterblocks')} position='right'>
                                    <span style={{float:'right', marginRight:'2px'}}><i className="fa fa-info-circle" /></span>
                                </Tooltip>
                                {/*</Tooltip>*/}
                            </li>
                        }
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
