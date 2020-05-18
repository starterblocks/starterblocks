/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n'
import './style.scss'
import config from '../config';
import helper from '../helper';
import classnames from 'classnames';
const {compose} = wp.compose;
const {withDispatch, withSelect} = wp.data;
const {useState, useEffect, useRef} = wp.element;

function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

function ChallengeTimer({started, closed, setClosed}) {
    const [secondsLeft, setSecondsLeft] = useState(helper.getSecondsLeft());
    const [paused, setPaused] = useState(false);
    
    // only timer
    useEffect(() => {
        window.addEventListener('focus', resume);
        window.addEventListener('blur', pause);
        return () => {
            window.removeEventListener('focus', resume);
            window.removeEventListener('blur', pause);
        };
    });

    // setup timer
    useEffect(() => {
        setSecondsLeft(helper.getSecondsLeft());
        if (helper.loadStep() === -1) {
            setSecondsLeft(config.initialSecondsLeft);
        }
    }, []);

    // run timer
    useInterval(() => {
        setSecondsLeft(secondsLeft - 1);
        helper.saveSecondsLeft(secondsLeft);
    }, (started && (paused === false) && secondsLeft >= 0) ? 1000 : null);


    // Pause the timer.
    const pause = () => {
        setPaused(true);
    }

    // Resume the timer.
    const resume = () => {
        setPaused(false);
    }

    return (
        <div className='block-timer'>
            <div>
                <h3>{__('StarterBlocks Challenge', starterblocks.i18n)}</h3>
                <p><span>{helper.getFormatted(secondsLeft)}</span>{__(' remaining', starterblocks.i18n)}</p>
            </div>
            <div className={classnames('caret-icon', {'closed': closed})} onClick={() => setClosed(!closed)}>
                <i className="fa fa-caret-down"></i>
            </div>
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
])(ChallengeTimer);
