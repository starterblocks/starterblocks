/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n'
import './style.scss'
import config from '../config';
import helper from '../helper';
const {compose} = wp.compose;
const {withDispatch, withSelect} = wp.data;
const {useState, useEffect} = wp.element;


function ChallengeTimer({started}) {
    const [secondsLeft, setSecondsLeft] = useState()

    // setup windows focus/blue event handling
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
        var timerId = helper.loadId();

        if ( timerId ) {
            clearInterval( timerId );
            setSecondsLeft(helper.getSecondsLeft());
        }

        if ( ! timerId && 0 === helper.loadStep() ) {
            setSecondsLeft(config.initialSecondsLeft);
        }
    }, []);

    useEffect(() => {
        if (started) run(helper.getSecondsLeft());
    }, [started]);

    /**
     * Run the timer.
     */
    const run =( secondsLeft ) => {

        if ( config.list.length === helper.loadStep() ) {
            return;
        }

        var timerId = setInterval( function() {
            setSecondsLeft(secondsLeft - 1);
            if ( 1 > secondsLeft ) {
                helper.saveSecondsLeft( 0 );
                clearInterval( timerId );
            }
        }, 1000 );

        helper.saveId( timerId );

        return timerId;
    }

    /**
     * Pause the timer.
     */
    const pause = () => {

        var timerId;
        var secondsLeft = helper.getSecondsLeft();

        if ( 0 === secondsLeft || config.lastStep === helper.loadStep() ) {
            return;
        }

        timerId = helper.loadId();
        clearInterval( timerId );

    }

    /**
     * Resume the timer.
     */
    const resume = () => {

        var timerId;
        var secondsLeft = helper.getSecondsLeft();

        if ( 0 === secondsLeft || config.lastStep === helper.loadStep() ) {
            return;
        }

        timerId = helper.loadId();

        if ( timerId ) {
            clearInterval( timerId );
        }

        run( secondsLeft );
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
