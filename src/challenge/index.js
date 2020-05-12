/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n'
import './style.scss'
import helper from './helper';
import ChallengeListBlock from './challenge-list-block';
import ChallengeTimer from './challenge-timer';

const {compose} = wp.compose;
const {withDispatch, withSelect} = wp.data;
const {useState, useEffect} = wp.element;

const START_STEP = -1;

function StarterBlocksChallenge(props) {
    const {autoTourStart} = props;
    const {setTourActiveButtonGroup, setTourPreviewVisible, setTourOpen, setImportingTemplate} = props;
    const [challengeClassname, setChallengeClassname] = useState('starterblocks-challenge');
    const [started, setStarted] = useState(false);
    const [currentStep, setCurrentStep] = useState(helper.loadStep());

    useEffect(() => {
        if (currentStep === START_STEP) setChallengeClassname('starterblocks-challenge challenge-start')
    }, []);

    useEffect(() => {
        if (autoTourStart === true) {
            setTourOpen(true);
            delete starterblocks.tour;
        }
    }, [autoTourStart]);

    const onStarted = () => {
        setCurrentStep(currentStep + 1);
        setStarted(true);
    }

    return (
        <div className={challengeClassname}>
            <ChallengeListBlock {...{currentStep, started, onStarted}} />
            <ChallengeTimer started={started} />
        </div>
    );

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
])(StarterBlocksChallenge);
