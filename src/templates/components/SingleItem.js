const {__} = wp.i18n
const {useContext} = wp.element;
import SingleItemContext from '../contexts/SingleItemContext';
import ButtonGroup from './ButtonGroup';
import {missingPro, missingRequirement} from '../stores/helper';

export default (props) => {
    // Decoupling props
    const {data} = useContext(SingleItemContext);

    const {backgroundImage} = props;
    const {ID, image, url, pro, requirements} = data;
    const background = {
        'background-image': 'url(' + starterblocks.plugin + 'assets/img/image-loader.gif)',
        'background-position': 'center center'
    }

    const isMissingRequirement = missingRequirement(pro, requirements);
    const isMissingPro = missingPro(pro);
    return (
        <div className={'starterblocks-single-section-item '}>
            <div
                className={'starterblocks-single-item-inner starterblocks-item-wrapper '}
                style={background}>
                <div className="starterblocks-default-template-image">
                    <img className="lazy" src={backgroundImage(image)}/>
                    {pro && <span className="starterblocks-pro-badge">{__('Pro')}</span>}
                </div>
                {/* starterblocks-default-template-image */}
                <div className="starterblocks-button-overlay">
                    <ButtonGroup/>
                </div>
            </div>
            {/* starterblocks-item-wrapper */}
        </div>
    )
}
