const {__} = wp.i18n;
const {compose} = wp.compose;
const {withDispatch, withSelect} = wp.data;

import {IconButton} from '@wordpress/components'
import SVGViewFew from './images/view-few.svg'
import SVGViewMany from './images/view-many.svg'
import SVGViewNormal from './images/view-normal.svg'
import {reloadLibrary} from '~starterblocks/stores/actionHelper';
import './style.scss'

function TemplateListSubHeader(props) {
    const {itemType, sortBy, activeCollection, statistics, pageData, columns, loading} = props;
    const {setSortBy, setColumns, setTourOpen} = props;

    const itemTypeLabel = () => {
        if (itemType === 'section') return __('Sections', starterblocks.i18n);
        if (itemType === 'page') return __('Pages', starterblocks.i18n);
        if (itemType === 'collection' && activeCollection === null) return __('Collections', starterblocks.i18n);
        if (itemType === 'collection' && activeCollection !== null) return __('Sections', starterblocks.i18n);
    };

    const dataLength = pageData ? pageData.length : '';

    let pageTitle = '';
    if (loading === false && dataLength && dataLength !== 0) {
        pageTitle = <span>{dataLength} {itemTypeLabel()}</span>;
    }

    return (
        <div className="starterblocks-template-list-sub-header">
            <h4>
                {pageTitle}
            </h4>
            <div className="starterblocks-template-filters">
                <IconButton
                    icon={<i className="far fa-question-circle tour-icon"/>}
                    label={__('Trigger Tour', starterblocks.i18n)}
                    onClick={() => setTourOpen(true)}
                />

                <IconButton
                    icon="image-rotate"
                    label={__('Refresh Library', starterblocks.i18n)}
                    className="refresh-library"
                    onClick={reloadLibrary}
                />
                <IconButton
                    icon={<SVGViewFew width="18" height="18"/>}
                    className={columns === 'large' ? 'is-active' : ''}
                    label={__('Large preview', starterblocks.i18n)}
                    onClick={() => setColumns('large')}
                />
                <IconButton
                    icon={<SVGViewNormal width="18" height="18"/>}
                    className={columns === '' ? 'is-active' : ''}
                    label={__('Medium preview', starterblocks.i18n)}
                    onClick={(e) => setColumns('')}
                />
                <IconButton
                    icon={<SVGViewMany width="18" height="18"/>}
                    className={columns === 'small' ? 'is-active' : ''}
                    label={__('Small preview', starterblocks.i18n)}
                    onClick={(e) => setColumns('small')}
                />
                <div className="">
                    <select name="sortBy" id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="name">{__('Name', starterblocks.i18n)}</option>
                        {/*<option value="popularity">{__('Popularity', starterblocks.i18n)}</option>*/}
                        <option value="updated">{__('Updated', starterblocks.i18n)}</option>
                    </select>
                </div>
            </div>
        </div>
    );
}


export default compose([
    withDispatch((dispatch) => {
        const {setLibrary, setActivePriceFilter, setActiveCollection, setSortBy, setColumns, setTourOpen} = dispatch('starterblocks/sectionslist');
        return {
            setLibrary,
            setActivePriceFilter,
            setActiveCollection,
            setSortBy,
            setColumns,
            setTourOpen
        };
    }),

    withSelect((select, props) => {
        const {fetchLibraryFromAPI, getActiveItemType, getColumns, getPageData, getActiveCollection, getStatistics, getSortBy, getLoading} = select('starterblocks/sectionslist');
        return {
            fetchLibraryFromAPI,
            itemType: getActiveItemType(),
            pageData: getPageData(),
            columns: getColumns(),
            statistics: getStatistics(),
            sortBy: getSortBy(),
            activeCollection: getActiveCollection(),
            loading: getLoading()
        };
    })
])(TemplateListSubHeader);
