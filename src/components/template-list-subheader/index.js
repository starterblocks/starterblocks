const {__} = wp.i18n;
const {compose} = wp.compose;
const {withDispatch, withSelect, select} = wp.data;
const {Component, useContext, useState} = wp.element;

import {IconButton} from '@wordpress/components'
import TemplateModalContext from '../../contexts/TemplateModalContext';
import SVGViewFew from './images/view-few.svg'
import SVGViewMany from './images/view-many.svg'
import SVGViewNormal from './images/view-normal.svg'

import './style.scss'

function TemplateListSubHeader(props) {
    const {fetchLibraryFromAPI, itemType, activePriceFilter, sortBy, activeCollection, statistics, pageData} = props;
    const {setLibrary, setActivePriceFilter, setActiveCollection, setSortBy, columns, setColumns} = props;
    const {resetLibrary} = useContext(TemplateModalContext);

    const itemTypeLabel = () => {
        if (itemType === 'section') return __('Sections');
        if (itemType === 'page') return __('Pages');
        if (itemType === 'collection' && activeCollection === null) return __('Collections');
        if (itemType === 'collection' && activeCollection !== null) return __('Sections');
    };

    const getClassnames = (priceFilter) => {
        let classNames = [];
        classNames.push((priceFilter === activePriceFilter) ? 'active' : '');
        classNames.push(noStatistics(priceFilter) ? 'disabled' : '');
        return classNames.join(' ');
    };

    const noStatistics = (priceFilter) => {
        if (priceFilter === '') return false;
        if (priceFilter === 'free')
            return (!statistics['false'] || statistics['false'] < 1);
        else
            return (!statistics['true'] || statistics['true'] < 1);
    };

    const dataLength = pageData ? pageData.length : '';

    let page_title = '';
    if (dataLength && dataLength !== 0) {
        page_title = <span>{dataLength} {itemTypeLabel()}</span>;
    }

    return (
        <div className="starterblocks-template-list-sub-header">
            <h4>
                {page_title}
            </h4>
            <div className="starterblocks-template-filters">
                <IconButton
                    icon="image-rotate"
                    label={__('Refresh Library')}
                    className="ugb-modal-design-library__refresh"
                    onClick={resetLibrary}
                />
                <IconButton
                    icon={<SVGViewFew width="18" height="18"/>}
                    className={columns === 'large' ? 'is-active' : ''}
                    label={__('Large preview')}
                    onClick={() => setColumns('large')}
                />
                <IconButton
                    icon={<SVGViewNormal width="18" height="18"/>}
                    className={columns === '' ? 'is-active' : ''}
                    label={__('Medium preview')}
                    onClick={(e) => setColumns('')}
                />
                <IconButton
                    icon={<SVGViewMany width="18" height="18"/>}
                    className={columns === 'small' ? 'is-active' : ''}
                    label={__('Small preview')}
                    onClick={(e) => setColumns('small')}
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
        const {setLibrary, setActivePriceFilter, setActiveCollection, setSortBy, setColumns} = dispatch('starterblocks/sectionslist');
        return {
            setLibrary,
            setActivePriceFilter,
            setActiveCollection,
            setSortBy,
            setColumns
        };
    }),

    withSelect((select, props) => {
        const {fetchLibraryFromAPI, getActiveItemType, getColumns, getPageData, getActivePriceFilter, getActiveCollection, getStatistics, getSortBy} = select('starterblocks/sectionslist');
        return {
            fetchLibraryFromAPI,
            itemType: getActiveItemType(),
            pageData: getPageData(),
            columns: getColumns(),
            statistics: getStatistics(),
            activePriceFilter: getActivePriceFilter(),
            sortBy: getSortBy(),
            activeCollection: getActiveCollection()
        };
    })
])(TemplateListSubHeader);
