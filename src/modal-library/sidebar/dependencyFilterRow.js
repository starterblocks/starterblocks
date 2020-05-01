import React from 'react';
const {Component, useState, useEffect} = wp.element;
const {compose} = wp.compose;
const {select, withDispatch, withSelect} = wp.data;
const {__} = wp.i18n;

import {CheckboxControl, Tooltip} from '@wordpress/components';
import {pluginInfo} from '~starterblocks/stores/dependencyHelper';
import groupBy from 'lodash/groupBy';

function DependencyFilterRow(props) {
    const {pluginKey, dependencyFilters} = props;
    const {setDependencyFilters} = props;

    const pluginInstance = pluginInfo(pluginKey);
    let pluginClassname = '';

    if (!pluginKey || pluginKey === 'none') return null;

    if (!pluginInstance || pluginInstance.name == null) {
        return null// Skip extra items
    }

    if (pluginInstance) {
        let pluginClassnameList = [];
        pluginClassnameList.push(!pluginInstance.version && !('no_plugin' in pluginInstance) ? 'missing-dependency' : '');
        pluginClassnameList.push((!dependencyFilters[pluginKey] || dependencyFilters[pluginKey].disabled) ? 'disabled' : '');
        pluginClassname = pluginClassnameList.join(' ');
    }


    const isChecked = (pluginKey) => {
        if (dependencyFilters.hasOwnProperty(pluginKey)){
            if (dependencyFilters[pluginKey].disabled) return false;
            return dependencyFilters[pluginKey].hasOwnProperty('value') ? dependencyFilters[pluginKey].value : dependencyFilters[pluginKey];
        }
        return false;
    };

    const toggleChecked = (pluginKey) => {
        // disable check first
        if (dependencyFilters[pluginKey] === null || dependencyFilters[pluginKey] === undefined || dependencyFilters[pluginKey].disabled) return;


        let newDependencyFilters = {...dependencyFilters,
            [pluginKey]: { value: dependencyFilters[pluginKey].value === false, disabled: dependencyFilters[pluginKey]['disabled'] === true }};
        let valueCount = groupBy(Object.keys(newDependencyFilters), key => (newDependencyFilters[key] === true || newDependencyFilters[key].value === true));

        if (valueCount['true'] && valueCount['true'].length > 0 && valueCount['false'] && valueCount['false'].length > 0) {
            setDependencyFilters({...newDependencyFilters, none: {value: false, disabled: newDependencyFilters['none']['disabled']}});
        } else {
            setDependencyFilters({...newDependencyFilters, none: {value: true, disabled: newDependencyFilters['none']['disabled']}});
        }
    };

    return (
        <li className={pluginClassname}>
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
}


export default compose([
    withDispatch((dispatch) => {
        const {setDependencyFilters} = dispatch('starterblocks/sectionslist');
        return {
            setDependencyFilters
        };
    }),

    withSelect((select, props) => {
        const {getDependencyFiltersStatistics, getLoading, getPlugins} = select('starterblocks/sectionslist');
        return {
            loading: getLoading(),
            dependencyFilters: getDependencyFiltersStatistics(),
            plugins: getPlugins()
        };
    })
])(DependencyFilterRow);
