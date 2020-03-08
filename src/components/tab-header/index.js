const { Component } = wp.element;
const { compose } = wp.compose;
const { select, withDispatch, withSelect } = wp.data;
const { __ } = wp.i18n;
import { ModalManager } from '../../modal-manager';

function TabHeader(props) {
    const { activeItemType, searchContext, activeCollection } = props;
    const { setActiveItemType, setSearchContext } = props;

    const isActive = (itemType) => {
        return (activeItemType === itemType) ? 'active' : '';
    }

    const onSearchContextUpdate = (e) => {
        if (activeItemType !=='saved') setSearchContext(e.target.value);
    }

    return (
        <div className="starterblocks-builder-modal-header">
            <div className="template-search-box">
                {
                    ((activeItemType !== 'collection'  || activeCollection === null) && activeItemType !== 'saved') &&
                    <div>
                        <i className="fas fa-search" />
                        <input type="search" placeholder={__('Type to search')} className="form-control" value={searchContext} onChange={onSearchContextUpdate} />
                    </div>
                }
            </div>

            <div className="starterblocks-template-list-header">
                <button className={ isActive('section') } onClick={e => setActiveItemType('section')}> {__('Sections')} </button>
                <button className={ isActive('page') } onClick={e => setActiveItemType('page')}> {__('Pages')} </button>
                <button className={ isActive('collection') } onClick={e => setActiveItemType('collection')}> {__('Collections')} </button>
                <button className={ isActive('saved') } onClick={e => setActiveItemType('saved')}> {__('Saved')} </button>
                <button className="starterblocks-builder-close-modal" onClick={e => { ModalManager.close() }} >
                    <i className={'fas fa-times'} />
                </button>
            </div>
        </div>
    );
}

export default compose([
    withDispatch((dispatch) => {
        const {
            setActiveItemType,
            setSearchContext
        } = dispatch('starterblocks/sectionslist');

        return {
            setActiveItemType,
            setSearchContext
        };
    }),

    withSelect((select, props) => {
        const { getActiveItemType, getSearchContext, getActiveCollection } = select('starterblocks/sectionslist');
        return { activeItemType: getActiveItemType(), searchContext: getSearchContext(), activeCollection: getActiveCollection() };
    })

])(TabHeader);
