/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n'
import './style.scss'
import config from '../config';
import helper from '../helper';
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

function ChallengeTimer({started}) {
    const [secondsLeft, setSecondsLeft] = useState(config.initialSecondsLeft);
    const [paused, setPaused] = useState(false);
    const [timerInterval, setTimerInterval] = useState(1000);

    // setup windows focus/blue event handling
    useEffect(() => {
        window.addEventListener('focus', resume);
        window.addEventListener('blur', pause);
        return () => {
            window.removeEventListener('focus', resume);
            window.removeEventListener('blur', pause);
        };
    });

    useInterval(() => {
        setSecondsLeft(secondsLeft - 1);
        helper.saveSecondsLeft(secondsLeft);
    }, (started && (paused === false) && secondsLeft >=0) ? 1000 : null);

    // setup timer
    useEffect(() => {
        setSecondsLeft(helper.getSecondsLeft());
 
        if (helper.loadStep() === -1) {
            setSecondsLeft(config.initialSecondsLeft);
        }
    }, []);

    /**
     * Run the timer.
     */
    const run =( secondsLeft ) => {

        if ( config.list.length === helper.loadStep() ) {
            return;
        }

        var timerId = setInterval( function() {
            setSecondsLeft(secondsLeft => secondsLeft - 1);
            helper.saveSecondsLeft( secondsLeft );
            if ( 1 > secondsLeft ) {
                helper.saveSecondsLeft( 0 );
                clearInterval( timerId );
            }
        }, 1000 );

        helper.saveId( timerId );

        return timerId;
    }

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
            <div class="caret-icon">
                <i class="fa fa-caret-down"></i>
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
