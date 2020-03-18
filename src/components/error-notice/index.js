import {__} from '@wordpress/i18n';
import {compose} from '@wordpress/compose';
import {withDispatch, withSelect, select} from '@wordpress/data';
import {Notice} from '@wordpress/components';

export function ErrorNotice(props) {
    const {discardAllErrorMessages, errorMessages} = props;
    return(
        <Notice status="error" onRemove={discardAllErrorMessages}>
            <p>An error occurred:
                {
                    errorMessages.join(', ')
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
