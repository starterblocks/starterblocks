const {Component, useState, useEffect, useRef} = wp.element;
const {Spinner} = wp.components;
import { useTransition, animated } from 'react-spring';

const MESSAGE_DELAY_MILLISECONDS = 4000;

const MESSAGES_LIST = [
    'Please wait while your template is prepared.',
    'Fetching the template.',
    'We\'re getting closer now.',
    'Wow, this is taking a long time.',
    'Gah, this should be done by now!',
    'Really, this should be done soon.',
    'Are you sure your internet is working?!',
    'Give up, it looks like it didn\'t work...'
];

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

export default function ImportingStep(props) {
    const [messageIndex, setMessageIndex] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState(MESSAGES_LIST[0]);

    useInterval(() => {
        if (messageIndex === MESSAGES_LIST.length) return;
        setMessageIndex(messageIndex => messageIndex + 1);
        setLoadingMessage([MESSAGES_LIST[messageIndex + 1]]);
    }, MESSAGE_DELAY_MILLISECONDS)

    return (
        <div className="starterblocks-modal-body">
            <div className="starterblocks-import-wizard-spinner-wrapper">
                <h3>{loadingMessage}</h3>
                <Spinner/>
            </div>
        </div>
    );
};
