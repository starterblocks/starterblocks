const {__} = wp.i18n
const {Component, Fragment} = wp.element;
const {compose} = wp.compose;
const {withDispatch, withSelect, select} = wp.data;
const {Notice} = wp.components;
import SingleItemContext from "../contexts/SingleItemContext";
import TemplateModalContext from "../contexts/TemplateModalContext";
import {missingPro, missingRequirement} from "../stores/helper";

function ErrorNotice(props) {
    const {discardAllErrorMessages, errorMessages} = props;
    return(
        <Notice status="error" onRemove={discardAllErrorMessages}>
            <p>An error occurred:
                { 
                    errorMessages.join(", ") 
                }
            </p>
        </Notice>
    );
    
}



export default compose([
    withDispatch((dispatch) => {
        const {
            discardAllErrorMessages
        } = dispatch('starterblocks/sectionslist');

        return {
            discardAllErrorMessages
        };
    })
])(ErrorNotice);