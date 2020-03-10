const { Component, Fragment } = wp.element;

import Sidebar from '../sidebar';
import TemplateListSubHeader from '~starterblocks/components/template-list-subheader';
import TemplateList from '../view-template-list';


export default function WithSidebarCollection (props) {
    return (
        <Fragment>
            <div className="starterblocks-collection-modal-sidebar">
                <Sidebar />
            </div>
            <div className="starterblocks-collection-modal-content-area">
                <TemplateListSubHeader />
                <TemplateList />
            </div>
        </Fragment>
    );
}
