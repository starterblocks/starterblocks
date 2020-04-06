const {__} = wp.i18n
const {withDispatch, withSelect, select} = wp.data;
const {useContext, useState, useEffect} = wp.element;
const { Spinner } = wp.components;

import LazyLoad from 'react-lazyload';
import SingleItemContext from '../../contexts/SingleItemContext';
import ButtonGroup from '../button-group';
import {isBlockPro, missingPro, missingRequirement} from '../../stores/helper';
import './style.scss'


function SingleItem (props) {
	// Decoupling props
    const {data, column} = useContext(SingleItemContext);
	const {backgroundImage, tourActiveButtonGroup} = props;
    const {ID, image, url, pro, source, requirements} = data;
    const [innerClassname, setInnerClassname] = useState('starterblocks-single-item-inner starterblocks-item-wrapper ');
	const background = {
		'backgroundImage': 'url(' + starterblocks.plugin + 'assets/img/image-loader.gif)',
		'backgroundPosition': 'center center'
    };

    useEffect(() => {
        setInnerClassname((tourActiveButtonGroup && tourActiveButtonGroup.ID === ID) ? 'starterblocks-single-item-inner starterblocks-item-wrapper focused' : 'starterblocks-single-item-inner starterblocks-item-wrapper');
    }, [tourActiveButtonGroup]);

	const isMissingRequirement = missingRequirement(pro, requirements);
    const isMissingPro = missingPro(pro);

	return (
		<div className="starterblocks-single-section-item">
			<div className={innerClassname}>
				<div className="starterblocks-default-template-image">
                    <img className="lazy" src={backgroundImage(image)}/>
                    {isBlockPro(pro, source) && <span className="starterblocks-pro-badge">{__('Premium')}</span>}
                    <div className="starterblocks-tmpl-title">{data.name}</div>
				</div>
				{/* starterblocks-default-template-image */}
				<div className="starterblocks-button-overlay">
                    {isBlockPro(pro, source) && <span className="starterblocks-pro-badge">{__('Premium')}</span>}
					<ButtonGroup />
				</div>

			</div>
			{/* starterblocks-item-wrapper */}
		</div>
	)
}


export default withSelect((select, props) => {
    const {getTourActiveButtonGroup} = select('starterblocks/sectionslist');
    return {
        tourActiveButtonGroup: getTourActiveButtonGroup()
    };
})(SingleItem);
