import {Tooltip} from '@wordpress/components';

const {__} = wp.i18n
const {withDispatch, withSelect, select} = wp.data;
const {useState, useEffect} = wp.element;

import ButtonGroup from '../button-group';
import BackgroundImage from '../background-image';
import {requiresInstall, requiresPro} from '~starterblocks/stores/dependencyHelper'

import './style.scss'


function SingleItem (props) {
    // Decoupling props
    const {pageData, tourActiveButtonGroup, index} = props;
    const {backgroundImage} = props;
    const [data, setData] = useState(null);
    // const {ID, image, url, pro, source, requirements} = data;
    const [innerClassname, setInnerClassname] = useState('starterblocks-single-item-inner starterblocks-item-wrapper ');
    const background = {
        'backgroundImage': 'url(' + starterblocks.plugin + 'assets/img/image-loader.gif)',
        'backgroundPosition': 'center center'
    };


    useEffect(() => {
        if (pageData) setData(pageData[index]);
    }, [index, pageData]);

    useEffect(() => {
        setInnerClassname((pageData && pageData[index] && tourActiveButtonGroup && tourActiveButtonGroup.ID === pageData[index].ID) ?
            'starterblocks-single-item-inner starterblocks-item-wrapper focused' : 'starterblocks-single-item-inner starterblocks-item-wrapper');
    }, [tourActiveButtonGroup, pageData, index]);

    if (!data) return null;
    return (
        <div className="starterblocks-single-section-item">
            <div className={innerClassname}>
                <div className="starterblocks-default-template-image">

                    {data.source !== 'wp_block_patterns' &&<img className="lazy" src={backgroundImage(data.image)}/>}
                    {data.source === 'wp_block_patterns' && <BackgroundImage data={data} />}
                    {requiresPro(data) && <span className="starterblocks-pro-badge">{__('Premium')}</span>}
                    {!requiresPro(data) && requiresInstall(data) && <span className="starterblocks-missing-badge"><i className="fas fa-exclamation-triangle" /></span>}
                    <div className="starterblocks-tmpl-title">{data.name}</div>
                </div>
                {/* starterblocks-default-template-image */}
                <div className="starterblocks-button-overlay">
                    {requiresPro(data) && <span className="starterblocks-pro-badge">{__('Premium')}</span>}
                    {!requiresPro(data) && requiresInstall(data) && <Tooltip text={__('Required Plugins')} position="bottom" key={data.source+data.source_id}><div className="starterblocks-missing-badge"><i className="fas fa-exclamation-triangle" /></div></Tooltip>}
                    <ButtonGroup index={index} showDependencyBlock={true} data={data} pageData={pageData} />
                </div>

            </div>
            {/* starterblocks-item-wrapper */}
        </div>
    )
}


export default withSelect((select, props) => {
    const {getTourActiveButtonGroup, getPageData, getColumns} = select('starterblocks/sectionslist');
    return {
        pageData: getPageData(),
        tourActiveButtonGroup: getTourActiveButtonGroup()
    };
})(SingleItem);
