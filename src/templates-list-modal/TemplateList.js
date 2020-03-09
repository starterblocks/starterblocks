const { Component, useState } = wp.element;
const { compose, withState } = wp.compose;
const { withDispatch, withSelect, select } = wp.data;
const { Spinner } = wp.components;

import SingleItem from '../components/single-item'
import MultipleItem from '../components/multiple-item'

import { SingleItemProvider } from '../contexts/SingleItemContext';

import PreviewTemplate from '../preview-template';

function TemplateList(props) {
    const { pageData, loading, activeItemType, activeCollection } = props;
    const { insertBlocks, setActiveCollection} = props;

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


	if (!loading)
        return (
            <div id="modalContainer" className="starterblocks-template-list-modal">
                <div className="starterblocks-builder-template-list-container">

                    <div id="collections-sections-list" className="starterblocks-builder-page-templates">
                        { pageData &&
                            pageData.map((data, index) => (
                                <div className="starterblocks-pagelist-column">
                                    {
                                        (activeItemType !== 'collection' || activeCollection !== null) ?
                                            <SingleItemProvider value={{
                                                data,
                                                pageData,
                                                index,
                                                activeItemType,
                                                spinner: false
                                            }}>
                                                <SingleItem
                                                    key={index}
                                                    backgroundImage={(data) => getBackgroundImage(data)}
                                                />
                                            </SingleItemProvider>
                                        :
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
                                    }
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

        const {
            insertBlocks
        } = dispatch('core/block-editor');

        return {
            insertBlocks,
            setActiveCollection
        };
    }),

    withSelect((select, props) => {
        const { getPageData, getLoading, getActiveItemType, getActiveCollection} = select('starterblocks/sectionslist');
        return { pageData: getPageData(), loading: getLoading(), activeItemType: getActiveItemType(), activeCollection: getActiveCollection() };
    })
])(TemplateList);
