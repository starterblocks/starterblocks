const {__} = wp.i18n
import {isBlockPro} from '../../stores/helper';

const MultipleItem = (props) => {

    const {data: {pages, homepageData, ID, name}, backgroundImage, onSelectCollection} = props;
    const {image, pro, source} = homepageData || {};
    return (
        <div className="starterblocks-multiple-template-box">
            <div className="multiple-template-view" onClick={ () => onSelectCollection( ID ) } >
                <div className="starterblocks-default-template-image"><img alt={__('Default Template')} src={backgroundImage(image)} srcSet={backgroundImage(image)+ ' 2x'}/>
                    {isBlockPro(pro, source)&&
                        <span className="starterblocks-pro-badge"> {__('Premium')} </span>
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

export default MultipleItem
