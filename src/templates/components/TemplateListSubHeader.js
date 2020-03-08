const { __ } = wp.i18n;
const { compose } = wp.compose;
const { withDispatch, withSelect, select } = wp.data;
const { Component } = wp.element;


function TemplateListSubHeader(props) {
    const { itemType, activePriceFilter, sortBy, activeCollection, statistics, pageData } = props;
    const { setActivePriceFilter, setActiveCollection, setSortBy } = props;

    const itemTypeLabel = () => {
        if (itemType === 'section') return __('Sections');
        if (itemType === 'page') return __('Pages');
        if (itemType === 'collection' && activeCollection === null) return __('Collections');
        if (itemType === 'collection' && activeCollection !== null) return __('Sections');
    }

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

    const dataLength = pageData ? pageData.length : 0;

    return (
        <div className="starterblocks-template-list-sub-header">
            <h4>
                { dataLength } {itemTypeLabel()}
            </h4>
            <div className="starterblocks-template-filters">
                <div className="">
                    <select name="sortBy" id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="name">{__('Name')}</option>
                        <option value="popularity">{__('Popularity')}</option>
                        <option value="updated">{__('Updated')}</option>
                    </select>
                </div>
                <div className="starterblocks-template-filter-button-group">
                    <button onClick={() => setActivePriceFilter('')} className={getClassnames('')}>{__('All')}</button>
                    <button onClick={() => setActivePriceFilter('free')} className={getClassnames('free')}
                        disabled={noStatistics('free')}>{__('Free')}</button>
                    <button onClick={() => setActivePriceFilter('pro')} className={getClassnames('pro')}
                        disabled={noStatistics('pro')}>
                        <img src={starterblocks.plugin + 'assets/img/icon-premium.svg'} alt="" />
                        {__('Premium')}
                    </button>
                </div>
            </div>
        </div>
    );
}


export default compose([
    withDispatch((dispatch) => {
        const { setActivePriceFilter, setActiveCollection, setSortBy } = dispatch('starterblocks/sectionslist');
        return {
            setActivePriceFilter,
            setActiveCollection,
            setSortBy
        };
    }),

    withSelect((select, props) => {
        const { getActiveItemType, getPageData, getActivePriceFilter, getActiveCollection, getStatistics, getSortBy } = select('starterblocks/sectionslist');
        return { itemType: getActiveItemType(), pageData: getPageData(), statistics: getStatistics(),
            activePriceFilter: getActivePriceFilter(), sortBy: getSortBy(), activeCollection: getActiveCollection() };
    })
])(TemplateListSubHeader);
