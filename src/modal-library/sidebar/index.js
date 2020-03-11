const {Component} = wp.element;
const {compose} = wp.compose;
const {select, withDispatch, withSelect} = wp.data;
const {__} = wp.i18n;

import './style.scss'

import PriceFilter from './priceFilter';
import CategoryFilter from './categoryFilter';
import DependencyFilter from './dependencyFilter';

function Sidebar(props) {
	const {itemType, layer, loading} = props;
	const hasSidebar = () => {
		return (itemType !== 'collection' || layer === null);
	};
	return (
		<div className="starterblocks-modal-sidebar-content">
			{
				hasSidebar() &&
				<div>
					<PriceFilter/>
					<CategoryFilter/>
					{/*
						TODO - Hide if still loading from API
							{loading && <DependencyFilter/>}
					*/}
					<DependencyFilter/>
				</div>
			}
		</div>
	);
}

export default withSelect((select, props) => {
	const {getActiveItemType, getActiveCollection} = select('starterblocks/sectionslist');
	return {
		itemType: getActiveItemType(),
		layer: getActiveCollection()
	};
})(Sidebar);
