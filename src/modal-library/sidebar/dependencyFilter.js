const {Component, Fragment} = wp.element;
const {compose} = wp.compose;
const {select, withDispatch, withSelect} = wp.data;
const {__} = wp.i18n;

import {CheckboxControl, Tooltip} from '@wordpress/components';
import DependencyFilterRow from './dependencyFilterRow';


function DependencyFilter(props) {
    const {dependencyFilters, loading, plugins} = props;
    const {setDependencyFilters} = props;

    const onChangeCategory = (data) => {
        if (isDisabledCategory(data)) return;
        setActiveCategory(data.slug);
    };
    // Give the selected category(activeCategory) label className as "active"
    const isNoneChecked = () => {
        if (dependencyFilters.hasOwnProperty('none'))
            return dependencyFilters['none'].hasOwnProperty('value') ? dependencyFilters['none'].value : dependencyFilters['none'];
        return false;
    };

    const toggleNoneChecked = (pluginKey) => {
        setDependencyFilters({...dependencyFilters,
            none: { value: dependencyFilters['none'].value === false, disabled: dependencyFilters['none']['disabled'] === true }
        });
    };

    const setAllCheckedAs = (newVal) => {
        setDependencyFilters(
            Object.keys(dependencyFilters)
                .filter(key => key!=='none')
                .reduce((acc, key) => {
                    const disabled = dependencyFilters[key] ? dependencyFilters[key]['disabled'] : false;
                    return {...acc, [key]: {value: disabled ? false : newVal, disabled }}
                }, {none: {value: true, disabled: false}})
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
                                    checked={isNoneChecked()}
                                    onChange={() => toggleNoneChecked('none')}
                                />
                                <Tooltip text={__('Only default WordPress blocks used.', 'starterblocks')} position='right'>
                                    <span style={{float:'right', marginRight:'2px'}}><i className="fa fa-info-circle" /></span>
                                </Tooltip>
                                {/*</Tooltip>*/}
                            </li>
                        }
                        {
                            Object.keys(dependencyFilters).sort().map(pluginKey =>
                                <DependencyFilterRow key={pluginKey} pluginKey={pluginKey} />
                            )
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
        const {getDependencyFiltersStatistics, getLoading, getPlugins} = select('starterblocks/sectionslist');
        return {
            loading: getLoading(),
            dependencyFilters: getDependencyFiltersStatistics(),
            plugins: getPlugins()
        };
    })
])(DependencyFilter);
