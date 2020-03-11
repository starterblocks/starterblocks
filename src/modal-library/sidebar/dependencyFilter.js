const {Component, Fragment} = wp.element;
const {compose} = wp.compose;
const {select, withDispatch, withSelect} = wp.data;
const {__} = wp.i18n;

function DependencyFilter (props) {
    const {categoryData, activeCategory, activePriceFilter, itemType, layer, statistics} = props;
    const {setActiveCategory} = props;

    const onChangeCategory = (data) => {
        if (isDisabledCategory(data)) return;
        setActiveCategory(data.slug);
    };
    // Give the selected category(activeCategory) label className as "active"
    const isChecked = (data) => {
    };

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
                <li className={'missing-dependency'}>
                    <CheckboxControl
                        label="Is author"
                        help="Is the user a author or not?"
                        checked={ isChecked }
                        onChange={ setChecked }
                    />
                </li>
                <li>Stackable</li>
            </ul>
        </Fragment>
    );
}

export default compose([
    withDispatch((dispatch) => {
        const {
            setActiveCategory
        } = dispatch('starterblocks/sectionslist');

        return {
            setActiveCategory
        };
    }),

    withSelect((select, props) => {
        const {getCategoryData, getActiveCategory, getPageData, getActiveItemType, getActiveCollection, getStatistics, getActivePriceFilter} = select('starterblocks/sectionslist');
        return {
            categoryData: getCategoryData(),
            pageData: getPageData(),
            activeCategory: getActiveCategory(),
            itemType: getActiveItemType(),
            layer: getActiveCollection(),
            activePriceFilter: getActivePriceFilter(),
            statistics: getStatistics()
        };
    })
])(DependencyFilter);
