const { Component, Fragment, useRef, useEffect } = wp.element;
const { withSelect, select } = wp.data;
import Sidebar from '../sidebar';
import TemplateListSubHeader from '~starterblocks/components/template-list-subheader';
import TemplateList from '../view-template-list';


function WithSidebarCollection (props) {
    const { pageData } = props;
    const contentAreaRef = useRef(null);
    useEffect(() => {
        contentAreaRef.current.scrollTop = 0;
    }, [pageData])

    return (
        <Fragment>
            <div className="starterblocks-collection-modal-sidebar">
                <Sidebar />
            </div>
            <div className="starterblocks-collection-modal-content-area" ref={contentAreaRef}>
                <TemplateListSubHeader />
                <TemplateList />
            </div>
        </Fragment>
    );
}


export default
    withSelect((select, props) => {
        const { getPageData } = select('starterblocks/sectionslist');
        return { pageData: getPageData() };
    })(WithSidebarCollection);
