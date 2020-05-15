const { Fragment } = wp.element;
import Sidebar from '../sidebar';
import TemplateListSubHeader from '~starterblocks/components/template-list-subheader';
import TemplateList from '../view-template-list';

import ChallengeDot from '~starterblocks/challenge/tooltip/ChallengeDot';

export default function WithSidebarCollection (props) {
    return (
        <Fragment>
            <div id="starterblocks-collection-modal-sidebar" className="starterblocks-collection-modal-sidebar">
                <Sidebar />
            </div>
            <div className="starterblocks-collection-modal-content-area" data-tut="tour__main_body" id="modalContent">
                <ChallengeDot step={3} />
                <TemplateListSubHeader />
                <TemplateList />
            </div>
        </Fragment>
    );
}
