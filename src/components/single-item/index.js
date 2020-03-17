const {__} = wp.i18n
const {useContext} = wp.element;
const { Spinner } = wp.components;

import LazyLoad from 'react-lazyload';
import SingleItemContext from '../../contexts/SingleItemContext';
import ButtonGroup from '../button-group';
import {missingPro, missingRequirement} from '../../stores/helper';
import './style.scss'

const Loading = ({height}) => (
    <div className="starterblocks-pagelist-column loading" style={{height: height}}>
        <Spinner />
    </div>
);

const NORMAL_HEIGHT = 300;
const SMALL_HEIGHT = 223;
const LARGE_HEIGHT = 468;

const SingleItem = (props) => {
	// Decoupling props
	const {data, column} = useContext(SingleItemContext);

	const {backgroundImage} = props;
    const {ID, image, url, pro, requirements} = data;

    let height = NORMAL_HEIGHT;
    if (column === 'large') height = LARGE_HEIGHT;
    if (column === 'small') height = SMALL_HEIGHT;

	const background = {
		'backgroundImage': 'url(' + starterblocks.plugin + 'assets/img/image-loader.gif)',
		'backgroundPosition': 'center center'
	};

	const isMissingRequirement = missingRequirement(pro, requirements);
    const isMissingPro = missingPro(pro);

	return (

		<div className={'starterblocks-single-section-item '}>
			<div
				className={'starterblocks-single-item-inner starterblocks-item-wrapper '}>
				<div className="starterblocks-default-template-image">
                    <LazyLoad scrollContainer="modalContent" key={ID} placeholder={<Loading height={height} />} height={height} debounce={true}
                        once overflow offset={-200}>
                        <img className="lazy" src={backgroundImage(image)}/>
                        {pro && <span className="starterblocks-pro-badge">{__('Premium')}</span>}
                        <div className="starterblocks-tmpl-title">{data.name}</div>
                    </LazyLoad>
				</div>
				{/* starterblocks-default-template-image */}
				<div className="starterblocks-button-overlay">
					{pro && <span className="starterblocks-pro-badge">{__('Premium')}</span>}
					<ButtonGroup />
				</div>

			</div>
			{/* starterblocks-item-wrapper */}
		</div>
	)
}

export default SingleItem
