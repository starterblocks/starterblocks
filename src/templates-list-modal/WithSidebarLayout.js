const { Component, Fragment } = wp.element;

import Sidebar from './Sidebar';
import TemplateListSubHeader from '../components/template-list-subheader';
import TemplateList from './TemplateList';


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
