const { useState} = wp.element;
const { compose } = wp.compose;
const { withDispatch, withSelect, select } = wp.data;

const {__} = wp.i18n

import ButtonGroup from "../components/ButtonGroup";
import { SingleItemProvider } from "../contexts/SingleItemContext";

function CollectionView(props) {
    const { pageData, loading, activeCollection, activeItemType } = props;
    const { insertBlocks, setActiveCollection} = props;

    const [ previewDataIndex, setPreviewDataIndex ] = useState(0);

    const dataLength = pageData.length;

    let types = starterblocks_admin.mokama ? 'active' : 'inactive';
    let previewData = pageData[previewDataIndex];

    // Render Part
    return (
        <div className="starterblocks-collection-details-view">
            <div className="starterblocks-collection-details-left">
                <div className="details-back" onClick={() => setActiveCollection(null)}>
                    <span className="dashicons dashicons-arrow-left-alt" />&nbsp;Back to Collections
                </div>
                <div className="details-preview" style={{backgroundImage: `url('${previewData.image}')`}}>

                </div>
            </div>
            <div className="starterblocks-collection-details-right">
                <div className="details-title">
                    <h3>Section Title</h3>
                    <span>{ dataLength } pages</span>
                </div>
                <div className="details-list">
                    <div className="details-inner">
                        {
                            pageData.map((detail, index) => {
                                let className = (previewData.ID === detail.ID) ? "detail-select detail-select-active" : "detail-select";
                                let divStyle = {
                                    backgroundImage: 'url(' + detail.image + ')',
                                };

                                return (
                                    <div className={className} onClick={() => setPreviewDataIndex(index)}>
                                        <div className="detail-image" style={divStyle}>
                                            { detail.pro && <span className="pro">{__('Pro')}</span> }
                                            <div className="detail-label">{detail.name}</div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="starterblocks-collection-details-footer">
                <div className="footer-grid">
                    <SingleItemProvider value={{
                        data: previewData,
                        pageData,
                        index: previewDataIndex,
                        activeItemType,
                        spinner: false
                    }}>
                        <ButtonGroup />
                    </SingleItemProvider>
                </div>
            </div>
        </div>
    );
}


export default compose([
    withDispatch((dispatch) => {
        const {
            setActiveCollection
        } = dispatch('starterblocks/sectionslist');

        const {
            insertBlocks
        } = dispatch('core/block-editor');
        
        return {
            insertBlocks,
            setActiveCollection
        };
    }),

    withSelect((select, props) => {
        const { getPageData, getLoading, getActiveCollection, getActiveItemType } = select('starterblocks/sectionslist');
        return { pageData: getPageData(), loading: getLoading(), activeItemType: getActiveItemType(), activeCollection: getActiveCollection() };
    })
])(CollectionView);