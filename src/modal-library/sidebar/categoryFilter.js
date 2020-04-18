const {Component, Fragment} = wp.element;
const {compose} = wp.compose;
const {select, withDispatch, withSelect} = wp.data;
const {__} = wp.i18n;

import uniq from 'lodash/uniq';

function CategoryFilter (props) {
    const {categoryData, activeCategory, activePriceFilter, loading, itemType} = props;
    const {setActiveCategory} = props;


    // On the top, All Section, All Page, All Collection etc
    const itemTypeLabel = () => {
        if (itemType === 'section') return __('Section');
        if (itemType === 'page') return __('Page');
        if (itemType === 'collection') return __('Collection');
    };

    const totalItemCount = () => {
        let totalArr = [], filteredArr = [];
        categoryData.forEach((category) => {
            if (category.hasOwnProperty('filteredData')) filteredArr = [...filteredArr, ...category.filteredData];
            totalArr = [...totalArr, ...category.ids];
        });
        return (activePriceFilter !== '') ?  uniq(filteredArr).length + '/' + uniq(totalArr).length : uniq(totalArr).length;
    };

    const isDisabledCategory = (data) => (data && ((data.hasOwnProperty('filteredData') && data.filteredData.length === 0) || data.ids.length === 0));

    const onChangeCategory = (data) => {
        if (isDisabledCategory(data)) return;
        setActiveCategory(data.slug);
    };
    // Give the selected category(activeCategory) label className as "active"
    const activeClassname = (data) => {
        const categoryLabel = data ? data.slug : '';
        if (isDisabledCategory(data)) return 'disabled';
        return activeCategory === categoryLabel ? 'active' : '';
    };

    return (
        <div>
            <h3>{__('Categories', 'starterblocks')}</h3>
            {!loading &&
            <ul className="starterblocks-sidebar-categories">
                {categoryData.length > 0 &&
                <li
                    className={activeClassname(null)}
                    onClick={() => setActiveCategory('')}>
                    {__('All ')} {itemTypeLabel()}s <span>{totalItemCount()}</span>
                </li>
                }

                {categoryData &&
                categoryData.map((data, index) => (
                    <li className={activeClassname(data)} onClick={() => onChangeCategory(data)}
                        key={index}>
                        {data.name}
                        <span> {data.hasOwnProperty('filteredData') && activePriceFilter !== '' ? data.filteredData.length : data.ids.length } </span>
                    </li>
                ))
                }
            </ul>
            }
        </div>
    );
}

export default compose([
    withDispatch((dispatch) => {
        const {setActiveCategory} = dispatch('starterblocks/sectionslist');
        return {
            setActiveCategory
        };
    }),

    withSelect((select, props) => {
        const {getCategoryData, getActiveCategory, getActiveItemType, getLoading} = select('starterblocks/sectionslist');
        return {
            categoryData: getCategoryData(),
            activeCategory: getActiveCategory(),
            itemType: getActiveItemType(),
            loading: getLoading(),
        };
    })
])(CategoryFilter);