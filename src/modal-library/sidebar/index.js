const {Component} = wp.element;
const {compose} = wp.compose;
const {select, withDispatch, withSelect} = wp.data;
const {__} = wp.i18n;

import './style.scss'

import PriceFilter from './priceFilter';
import CategoryFilter from './categoryFilter';
import DependencyFilter from './dependencyFilter';

function Sidebar(props) {
    const {categoryData, activeCategory, itemType, layer, statistics} = props;
    const {setActiveCategory} = props;

    const getBlockDependencies = (dependencyData) => {
        return dependencyData;
    };

    const hasSidebar = () => {
        return (itemType !== 'collection' || layer === null);
    };

    return (
        <div className="starterblocks-modal-sidebar-content">
            {
                hasSidebar() &&
                <div>
                    <PriceFilter />
                    <CategoryFilter />
					<DependencyFilter />
                </div>
            }
        </div>
    );
}

export default compose([
    withDispatch((dispatch) => {
        const {setActivePriceFilter,
            setActiveCategory
        } = dispatch('starterblocks/sectionslist');

        return {
            setActivePriceFilter,
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
])(Sidebar);
