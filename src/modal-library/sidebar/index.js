const {Component} = wp.element;
const {compose} = wp.compose;
const {select, withDispatch, withSelect} = wp.data;
const {__} = wp.i18n;

import './style.scss'

function Sidebar(props) {
	const {categoryData, activeCategory, pageData, itemType, layer, activePriceFilter, statistics} = props;
	const {setActiveCategory, setActivePriceFilter} = props;

	// Give the selected category(activeCategory) label className as "active"
	const activeClassname = (categoryLabel) => {
		return activeCategory === categoryLabel ? 'active' : '';
	};

	const getClassnames = (priceFilter) => {
		let classNames = [];
		classNames.push((priceFilter === activePriceFilter) ? 'active' : '');
		classNames.push(noStatistics(priceFilter) ? 'disabled' : '');
		return classNames.join(' ');
	}

	const noStatistics = (priceFilter) => {
		if (priceFilter === '') return false;
		if (priceFilter === 'free')
			return (!statistics['false'] || statistics['false'] < 1);
		else
			return (!statistics['true'] || statistics['true'] < 1);
	}

	const getBlockDependencies = (dependencyData) => {
		return dependencyData;
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

	const totalItemCount = () => {
		return categoryData ? categoryData.reduce((sum, currentCat) => sum + currentCat.count, 0) : 0;
	};


	return (
		<div className="starterblocks-modal-sidebar-content">
			{
				hasSidebar() &&
				<div>
					{/*TODO - Move the filter from the main body to here!*/}

					{/*TODO - Move the filter from the main body to here!*/}
					<div className="starterblocks-template-filter-button-group">
						<div>
							<button onClick={() => setActivePriceFilter('')}
									className={getClassnames('')}>{__('All')}</button>
						</div>
						<div>
							<button onClick={() => setActivePriceFilter('free')} className={getClassnames('free')}
									disabled={noStatistics('free')}>{__('Free')}</button>
						</div>
						<div>
							<button onClick={() => setActivePriceFilter('pro')} className={getClassnames('pro')}
									disabled={noStatistics('pro')}>
								<img src={starterblocks.plugin + 'assets/img/icon-premium.svg'} alt=""/>
								{__('Premium')}
							</button>
						</div>
					</div>

					<h3>{__('Categories', 'starterblocks')}</h3>
					<ul className="starterblocks-sidebar-categories">
						<li
							className={activeClassname('')}
							onClick={() => setActiveCategory('')}>
							{__('All ')} {itemTypeLabel()}s <span>{totalItemCount()}</span>
						</li>
						{categoryData &&
						categoryData.map((data, index) => (
							<li className={activeClassname(data.slug)} onClick={() => setActiveCategory(data.slug)}
								key={index}>
								{data.name}
								<span> {data.hasOwnProperty('filteredCount') && activePriceFilter !== '' ? data.filteredCount : data.count} </span>
							</li>
						))
						}
					</ul>

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
						<li
							className={activeClassname('')}
							onClick={() => setActiveCategory('')}>
							{__('All')} <span>{totalItemCount()}</span>
						</li>
						<li className={'missing-dependency'}>Qubely</li>
						<li>Stackable</li>
					</ul>
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
