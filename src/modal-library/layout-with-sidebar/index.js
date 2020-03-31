const { Component, Fragment, useRef, useEffect } = wp.element;
const { withSelect, select } = wp.data;
import Sidebar from '../sidebar';
import TemplateListSubHeader from '~starterblocks/components/template-list-subheader';
import TemplateList from '../view-template-list';


function WithSidebarCollection (props) {
    const { pageData, activeItemType } = props;
    const contentAreaRef = useRef(null);
    /* useEffect(() => {
        contentAreaRef.current.scrollTop = 0;
    }, [pageData, activeItemType]) */

    return (
        <Fragment>
            <div className="starterblocks-collection-modal-sidebar">
                <Sidebar />
            </div>
            <div className="starterblocks-collection-modal-content-area" data-tut="tour__main_body" id="modalContent" ref={contentAreaRef}>
                <TemplateListSubHeader />
                <TemplateList />
            </div>
        </Fragment>
    );
}


export default
    withSelect((select, props) => {
        const { getPageData, getActiveItemType } = select('starterblocks/sectionslist');
        return { pageData: getPageData(), activeItemType: getActiveItemType() };
    })(WithSidebarCollection);
