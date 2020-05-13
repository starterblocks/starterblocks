import {compose} from '@wordpress/compose';
import {withDispatch, withSelect} from '@wordpress/data';

const {Children, cloneElement, createPortal} = wp.element;
const {useState, useEffect, useRef} = wp.element;

function Controller(props) {
    const {offsetX, offsetY, children} = props
    const {step, challengeStep, setChallengeStep} = props;
    const [isOpen, setIsOpen] = useState(false);
    const [style, setStyle] = useState({
        position: 'absolute',
        zIndex: 99999,
        top: 0,
        left: 0
    });
    const tooltipRef = useRef(null);

    const resize = (getElementBounding) => {
        if(offsetX === 'center' || offsetX === 'centre'){
            setStyle({
                ...style,
                left: getElementBounding.left + (getElementBounding.width - style.tooltipWidth)/2,
                top: getElementBounding.top + getElementBounding.height + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0)
            })
        }
        else{
            setStyle({
                ...style,
                left: getElementBounding.left,
                top: getElementBounding.top + getElementBounding.height + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0)
            })
        }
    }
    return Children.map(children, child => {
        if (child.type.name === 'Select')
            return cloneElement(child, {resize});
        else
            return (
                (step === challengeStep) && createPortal(
                    <span onClick={e => e.stopPropagation()} ref={tooltipRef} style={style}>{cloneElement(child)}</span>, 
                    document.body)
            );
    })
}



export default compose([
    withDispatch((dispatch) => {
        const {setChallengeStep} = dispatch('starterblocks/sectionslist');
        return {
            setChallengeStep
        };
    }),

    withSelect((select) => {
        const {getChallengeStep} = select('starterblocks/sectionslist');
        return {
            challengeStep: getChallengeStep()
        };
    })
])(Controller);