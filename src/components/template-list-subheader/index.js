const { __ } = wp.i18n;
const { compose } = wp.compose;
const { withDispatch, withSelect, select } = wp.data;
const { Component } = wp.element;

import SVGViewFew from './images/view-few.svg'
import SVGViewMany from './images/view-many.svg'
import SVGViewNormal from './images/view-normal.svg'

import {
	Modal, TextControl, IconButton, ToggleControl,
} from '@wordpress/components'

import './style.scss'

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
    };

    const resetLibrary = () => {
		// TODO - Set the state of the library to empty and loading
		// run fetchLibraryFromAPI() but pass in a variable so that method calls the API with no_cache=>True
		// This will invalidate the cache, and force an API refresh.
		// Then set the new library state, and display the content.
	};

    const noStatistics = (priceFilter) => {
        if (priceFilter === '') return false;
        if (priceFilter === 'free')
            return (!statistics['false'] || statistics['false'] < 1);
        else
            return (!statistics['true'] || statistics['true'] < 1);
    };

    const setColumns = (num) => {
    	this.state.columns = num
	};

    const dataLength = pageData ? pageData.length : '';
	const columns = 3;
    return (
        <div className="starterblocks-template-list-sub-header">
            <h4>
				{
					dataLength && <fragment>
						{ dataLength } {itemTypeLabel()}
					</fragment>
				}
            </h4>
            <div className="starterblocks-template-filters">
				<IconButton
					icon="image-rotate"
					label={ __( 'Refresh Library' ) }
					className="ugb-modal-design-library__refresh"
					onClick={ () => resetLibary() }
				/>

				<IconButton
					icon={ <SVGViewFew width="18" height="18" /> }
					className={ columns === 2 ? 'is-active' : '' }
					label={ __( 'Large preview' ) }
					onClick={ () => setColumns( 2 ) }
				/>
				<IconButton
					icon={ <SVGViewNormal width="18" height="18" /> }
					className={ columns === 3 ? 'is-active' : '' }
					label={ __( 'Medium preview' ) }
					onClick={ () => setColumns( 3 ) }
				/>
				<IconButton
					icon={ <SVGViewMany width="18" height="18" /> }
					className={ columns === 4 ? 'is-active' : '' }
					label={ __( 'Small preview' ) }
					onClick={ () => setColumns( 4 ) }
				/>
				<div className="">
					<select name="sortBy" id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
						<option value="name">{__('Name')}</option>
						<option value="popularity">{__('Popularity')}</option>
						<option value="updated">{__('Updated')}</option>
					</select>
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
