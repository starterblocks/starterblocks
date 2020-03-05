const { Component } = wp.element;
const { compose } = wp.compose;
const { select, withDispatch, withSelect } = wp.data;
const { __ } = wp.i18n;

function Sidebar(props) {
    const { categoryData, activeCategory, pageData, itemType, layer } = props;
    const { setActiveCategory } = props;

    // Give the selected category(activeCategory) label className as "active"
    const activeClassname = (categoryLabel) => {
        return activeCategory === categoryLabel ? 'active' : '';
    };

    const hasSidebar = () => {
        return (itemType !== 'collection' || layer === null);
    };

    // On the top, All Section, All Page, All Collection etc
    const itemTypeLabel = () => {
        if (itemType === 'section') return __('Section');
        if (itemType === 'page') return __('Page');
        if (itemType === 'collection') return __('Collection');
    };

    const totalCategoryCount = () => {
        return categoryData ? categoryData.reduce((sum, currentCat) => sum + currentCat.count, 0) : 0;
    };

    return ( 
        <div className="starterblocks-modal-sidebar-content">
            { 
                hasSidebar() &&
                <div>
                    <h3>Categories</h3>     
                    <ul className="starterblocks-template-categories">
                        <li
                            className={activeClassname('')}
                            onClick={() => setActiveCategory('')}>
                                {__('All ')} { itemTypeLabel() }s <span>{ totalCategoryCount() }</span>
                        </li>
                        { categoryData &&
                            categoryData.map((data, index) => (
                                <li className={activeClassname(data.slug)} onClick={() => setActiveCategory(data.slug)} key={index}>
                                    {data.name}
                                    <span> {data.count} </span>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            }
        </div>
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
        const { getCategoryData, getActiveCategory, getPageData, getActiveItemType, getActiveCollection } = select('starterblocks/sectionslist');
        return { categoryData: getCategoryData(), pageData: getPageData(), 
            activeCategory: getActiveCategory(), itemType: getActiveItemType(), layer: getActiveCollection() };
    })
])(Sidebar);
