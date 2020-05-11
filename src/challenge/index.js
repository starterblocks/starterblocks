/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n'
import './style.scss'
import ChallengeListBlock from './challenge-list-block';
import ChallengeTimer from './challenge-timer';

const {compose} = wp.compose;
const {withDispatch, withSelect} = wp.data;
const {useState, useEffect} = wp.element;

const START_STEP = 0;

function StarterBlocksChallenge(props) {
    const {autoTourStart} = props;
    const {setTourActiveButtonGroup, setTourPreviewVisible, setTourOpen, setImportingTemplate} = props;
    const {isTourOpen, getPageData} = props;
    const [challengeClassname, setChallengeClassname] = useState('starterblocks-challenge');
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (step === START_STEP) setChallengeClassname('starterblocks-challenge challenge-start')
    }, []);

    useEffect(() => {
        if (autoTourStart === true) {
            setTourOpen(true);
            delete starterblocks.tour;
        }
    }, [autoTourStart]);

    const onRequestClose = () => {
        ModalManager.closeCustomizer();
        setTourOpen(false);
        setTourActiveButtonGroup(null);
        setImportingTemplate(null);
    }


    return (
        <div className={challengeClassname}>
            <ChallengeListBlock step={step} />
            <ChallengeTimer />
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
