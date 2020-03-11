const {Component, Fragment} = wp.element;
const {compose} = wp.compose;
const {select, withDispatch, withSelect} = wp.data;
const {__} = wp.i18n;

import {CheckboxControl} from '@wordpress/components';

function DependencyFilter (props) {
    const {dependencyFilters} = props;
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
            Object.keys(dependencyFilters).reduce((acc, key) => {
                return {...acc, [key]: newVal}
            }, {})
        );
    };

    return (
        <Fragment>
            <h3>{__('Dependencies', 'starterblocks')}</h3>
            <ul className="starterblocks-sidebar-dependencies">
                <li>
                    <CheckboxControl
                        label="None"
                        checked={ isChecked('none') }
                        onChange={ () => toggleChecked('none') }
                    />
                </li>
                {
                    Object.keys(starterblocks.supported_plugins).map(pluginKey => {
                        const pluginInstance = starterblocks.supported_plugins[pluginKey];
                        return (
                            <li className={ pluginInstance.version ? 'missing-dependency' :''}>
                                <CheckboxControl
                                    label={pluginInstance.name}
                                    checked={ isChecked(pluginKey) }
                                    onChange={ () => toggleChecked(pluginKey) }
                                />
                            </li>
                        );

                    })
                }
            </ul>
            <span>
                <a onClick={() => setAllCheckedAs(true)}>Select All</a>
                <span>&nbsp; / &nbsp;</span>
                <a onClick={() => setAllCheckedAs(false)}>Deselect All</a>
            </span>
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
        const {getDependencyFilters} = select('starterblocks/sectionslist');
        return {
            dependencyFilters: getDependencyFilters()
        };
    })
])(DependencyFilter);
