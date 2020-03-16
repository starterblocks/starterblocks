const { Component, useState } = wp.element;
const { compose, withState } = wp.compose;
const { withDispatch, withSelect, select } = wp.data;
const { Spinner } = wp.components;
import LazyLoad from 'react-lazyload';

import SingleItem from '../../components/single-item'
import MultipleItem from '../../components/multiple-item'
import './style.scss'

import { SingleItemProvider } from '../../contexts/SingleItemContext';

import PreviewModal from '../../modal-preview';

const Loading = () => (
    <div className="starterblocks-pagelist-column loading" >
        <Spinner />
    </div>
);

function TemplateList(props) {
    const { pageData, loading, activeItemType, activeCollection, columns } = props;
    const { setActiveCollection} = props;

    const getBackgroundImage = (url) => {
        if (!url) {
            return starterblocks.plugin + 'assets/img/starterblocks-medium.jpg';
        }
        return url;
    }

    const onSelectCollection = (collectionID) => {
        setActiveCollection(collectionID);
    }

    let types = starterblocks.mokama ? 'active' : 'inactive';
    // Render Part
    if (!loading)
        return (
            <div id="modalContainer" className="starterblocks-template-list-modal">
                <div className="starterblocks-builder-template-list-container">

                    <div id="collections-sections-list" className={`starterblocks-builder-page-templates ${columns}`}>

                        { pageData &&
                            pageData.map((data, index) => (
                                (activeItemType !== 'collection' || activeCollection !== null) ?
                                    <LazyLoad key={index} placeholder={<Loading />} throtle={100} once overflow offset={-100}>
                                        <div className="starterblocks-pagelist-column" key={index}>
                                            {

                                                <SingleItemProvider value={{
                                                    data,
                                                    pageData,
                                                    index,
                                                    activeItemType,
                                                    spinner: false,
                                                    showDependencyBlock: true
                                                }}>
                                                    <SingleItem
                                                        key={index}
                                                        backgroundImage={(data) => getBackgroundImage(data)}
                                                    />
                                                </SingleItemProvider>

                                            }
                                        </div>
                                    </LazyLoad>
                                    :
                                    <div className="starterblocks-pagelist-column" key={index}>
                                        <MultipleItem
                                            key={index}
                                            data={data}
                                            index={index}
                                            types={types}
                                            itemType={activeItemType}
                                            spinner={false}
                                            onSelectCollection={onSelectCollection}
                                            backgroundImage={getBackgroundImage.bind(data)}
                                        />
                                    </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    else
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
        const { getPageData, getLoading, getColumns, getActiveItemType, getActiveCollection} = select('starterblocks/sectionslist');
        return { pageData: getPageData(), loading: getLoading(), activeItemType: getActiveItemType(), columns: getColumns(), activeCollection: getActiveCollection() };
    })
])(TemplateList);
