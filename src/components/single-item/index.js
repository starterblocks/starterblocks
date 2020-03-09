const {__} = wp.i18n
const {useContext} = wp.element;
import SingleItemContext from '../../contexts/SingleItemContext';
import ButtonGroup from '../button-group';
import {missingPro, missingRequirement} from '../../stores/helper';
import './style.scss'

const SingleItem = (props) => {
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
					{pro && <span className="starterblocks-pro-badge">{__('Premium')}</span>}
					<div className="starterblocks-tmpl-title">{data.name}</div>
				</div>
				{/* starterblocks-default-template-image */}
				<div className="starterblocks-button-overlay">
					{pro && <span className="starterblocks-pro-badge">{__('Premium')}</span>}
					<ButtonGroup/>
				</div>

			</div>
			{/* starterblocks-item-wrapper */}
		</div>
	)
}

export default SingleItem
