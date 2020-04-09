import {Tooltip} from '@wordpress/components';

const {__} = wp.i18n
import {isBlockPro} from '../../stores/helper';

const MultipleItem = (props) => {

    const {data: {pages, homepageData, ID, name, installDependencies, proDependencies}, backgroundImage, onSelectCollection} = props;
    const {image, pro, source} = homepageData || {};
    const requiresPro = () => proDependencies && proDependencies.length > 0;
    const requiresInstall = () => installDependencies && installDependencies.length > 0;

    return (
        <div className="starterblocks-multiple-template-box">
            <div className="multiple-template-view" onClick={ () => onSelectCollection( ID ) } >
                <div className="starterblocks-default-template-image"><img alt={__('Default Template')} src={backgroundImage(image)} srcSet={backgroundImage(image)+ ' 2x'}/>
                    {requiresPro() && <span className="starterblocks-pro-badge">{__('Premium')}</span>}
                    {!requiresPro() && requiresInstall() && <Tooltip text={__('Required Plugins')} position="bottom" key={ID}><div className="starterblocks-missing-badge"><i className="fas fa-exclamation-triangle" /></div></Tooltip>}
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
