const {__} = wp.i18n
const { Fragment } = wp.element;

export default (props) => {
    const {data: {pages, homepageData, ID, name}, backgroundImage, onSelectCollection} = props;
    const {image, pro} = homepageData || {};
    return (
        <div className="starterblocks-multiple-template-box">
            <div className="multiple-template-view" onClick={ () => onSelectCollection( ID ) } >
                <div className="starterblocks-default-template-image"><img alt={__('Default template')} src={backgroundImage(image)} srcSet={backgroundImage(image)+ ' 2x'}/>
                    { pro &&
                        <span className="starterblocks-pro-badge"> {__('Pro')} </span>
                    }
                </div>
                <div className="starterblocks-tmpl-info">
                    <h5 className="starterblocks-tmpl-title" dangerouslySetInnerHTML={{__html:name}}/>
                    <span className="starterblocks-temp-count">{ pages ? pages.length : 0 } {__('Pages')}</span>
                </div>
            </div>
        </div>
    );
}

