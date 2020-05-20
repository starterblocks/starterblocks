const { useState, useEffect } = wp.element;
const { compose } = wp.compose;
const { withDispatch, withSelect } = wp.data;
const { Spinner } = wp.components;

import SingleItem from '../../components/single-item'
import MultipleItem from '../../components/multiple-item'
import Pagination from '../../components/pagination'
import './style.scss'


import PreviewModal from '../../modal-preview';

import {columnMap, pageSizeMap} from '../../stores/helper';

function TemplateList(props) {
    const { pageData, loading, activeItemType, activeCollection, columns, currentPage } = props;
    const { setActiveCollection} = props;
    const [columnizedData, setColumnizedData] = useState([]);
    const [shouldShowPagination, setShouldShowPagination] = useState(false);
    const getBackgroundImage = (url) => {
        if (!url) {
            return starterblocks.plugin + 'assets/img/starterblocks-medium.jpg';
        }
        return url;
    }

    const onSelectCollection = (collectionID) => {
        setActiveCollection(collectionID);
    }

    useEffect(() => {
        let newData = [], index = 0;
        let colStr = (columns === '') ? 'medium' : columns;
        const columnsCount = columnMap[colStr];
        const pageSize = pageSizeMap[colStr];
        for (let i = 0; i < columnsCount; i++)
            newData[i] = [];
        if (pageData) {
            const lowerLimit = activeItemType !== 'collection' ? (currentPage * pageSize) + 1 : 1;
            const upperLimit = activeItemType !== 'collection' ? (currentPage + 1) * pageSize : pageData.length;
            for ( index = lowerLimit; index <= upperLimit && index <= pageData.length; index++) {
                newData[(index - 1) % columnsCount].push({...pageData[index - 1], index: index - 1});
            }
        }
        setColumnizedData(newData);
        setShouldShowPagination(activeItemType !== 'collection' && pageData && pageSize < pageData.length);
    }, [columns, pageData]);
    let types = starterblocks.mokama === '1' ? 'active' : 'inactive';


    if (!loading)
        return (
            <div id="modalContainer" className="starterblocks-template-list-modal">
                <div className="starterblocks-builder-template-list-container">
                    <div id="collections-sections-list" className={`starterblocks-builder-page-templates ${columns}`}>
                        { columnizedData &&
                            columnizedData.map((columnData, colIndex) => (
                                <div className="starterblocks-pagelist-column" key={colIndex}>
                                    {
                                        columnData &&
                                        columnData.map((data, cellIndex) => (
                                            (activeItemType !== 'collection' || activeCollection !== null) ?
                                                <SingleItem
                                                    key={cellIndex}
                                                    index={data.index}
                                                    backgroundImage={(data) => getBackgroundImage(data)}
                                                />
                                                :
                                                <MultipleItem
                                                    key={cellIndex}
                                                    data={data}
                                                    index={data.index}
                                                    types={types}
                                                    itemType={activeItemType}
                                                    spinner={false}
                                                    onSelectCollection={onSelectCollection}
                                                    backgroundImage={getBackgroundImage.bind(data)}
                                                />
                                        ))
                                    }
                                </div>
                            ))
                        }
                    </div>
                    { shouldShowPagination && <Pagination /> }
                </div>
            </div>
        );
    return (
        <div>
            <div style={{ height: '600px' }}>
                <div className="starterblocks-modal-loader">
                    <Spinner />
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

        return {
            setActiveCollection
        };
    }),

    withSelect((select, props) => {
        const { getPageData, getLoading, getColumns, getActiveItemType, getActiveCollection, getCurrentPage} = select('starterblocks/sectionslist');
        return { pageData: getPageData(), loading: getLoading(), activeItemType: getActiveItemType(), columns: getColumns(), activeCollection: getActiveCollection(), currentPage: getCurrentPage() };
    })
])(TemplateList);
