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
    const isChecked = (pluginInstance) => {
        return true;
    };

    console.log('dependencyFilters', dependencyFilters);

    const setChecked = (pluginInstance) => {
        console.log('pluginInstance', pluginInstance);
        // if ()
    }

    return (
        <Fragment>
            {/*
                Use starterblocks.supported_plugins to grab the index of all entries within the item.blocks
                Use starterblocks.supported_plugins[KEY].name to display here, but use the KEY to filter by

                Example: item.blocks : {
                    'qubely': ['section'],
                    'ugb': ['page', 'container']
                }

                Would display categories:
                    Qubely -> qubely
                    Stackable -> ugb
            */}
            <h3>{__('Dependencies', 'starterblocks')}</h3>
            <ul className="starterblocks-sidebar-dependencies">
                {
                    Object.keys(starterblocks.supported_plugins).map(pluginKey => {
                        const pluginInstance = starterblocks.supported_plugins[pluginKey];
                        return (
                            <li className={ pluginInstance.version ? 'missing-dependency' :''}>
                                <CheckboxControl
                                    label="Is author"
                                    help="Is the user a author or not?"
                                    checked={ isChecked(pluginInstance) }
                                    onChange={ () => toggleChecked(pluginInstance) }
                                />
                            </li>
                        );

                    })
                }

                <li>Stackable</li>
            </ul>
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
