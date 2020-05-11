/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n'
import CONFIG from '../config';
import './style.scss'

const {compose} = wp.compose;
const {withDispatch, withSelect} = wp.data;
const {useState, useEffect} = wp.element;

// currentStep : indicates where the step is
// step: 1~8 etc
function ChallengeStepItem(props) {
    const {currentStep, step, caption} = props;
    const [iconClassname, setIconClassname] = useState('fa circle');
    const [itemClassname, setItemClassname] = useState('challenge-item');
    useEffect(() => {
        if (currentStep < step) { // not completed step
            setItemClassname('challenge-item');
            setIconClassname('far fa-circle');
        }
        if (currentStep === step) { // current step
            setItemClassname('challenge-item challenge-item-current');
            setIconClassname('fas fa-circle');
        } 
        if (currentStep > step) {
            setItemClassname('challenge-item challenge-item-completed');
            setIconClassname('fas fa-check-circle');
        }
    }, [step, currentStep]);
    
    return <li className={itemClassname}><i className={iconClassname} />{caption}</li>;
}


export default compose([
    withDispatch((dispatch) => {
        const {setTourActiveButtonGroup, setTourPreviewVisible, setTourOpen, setImportingTemplate} = dispatch('starterblocks/sectionslist');
        return {
            setTourActiveButtonGroup,
            setTourPreviewVisible,
            setTourOpen,
            setImportingTemplate
        };
    }),

    withSelect((select, props) => {
        const {getTourOpen, getPageData} = select('starterblocks/sectionslist');
        return {
            isTourOpen: getTourOpen(),
            getPageData
        };
    })
])(ChallengeStepItem);
