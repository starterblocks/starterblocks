const {__} = wp.i18n;
const {useState} = wp.element;
const {apiFetch} = wp;
import {Modal, ModalManager} from '../modal-manager'
import './style.scss'

export default function FeedbackModal(props) {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const submitFeedback = () => {
        if (loading) return;
        setLoading(true);
        apiFetch({
            path: 'starterblocks/v1/feedback/',
            method: 'POST',
            headers: {'Registed-Blocks': installedBlocksTypes()},
            data: {
                'description': description,
                'theme_plugins': true, // Boolean
                'content': '', // Same as share dialog
                'template_id': ''// If section: `section-HASH` - If page: `page-HASH`
            }
        }).then(data => {
            setLoading(false);
            if (data.success) {
                alert('Successfully sent your feedback!');
            } else {
                alert('An unexpected error occured');
            }
            ModalManager.close();
        }).catch(err => {
            setLoading(false);
            alert('There was an error: ' + err);
            ModalManager.close();
        });
    }

    const onCloseWizard = () => {
        ModalManager.close();
    }

    return (
        <Modal compactMode={true}>
            <div className="starterblocks-feedback-modal-wrapper">
                <div className="starterblocks-modal-header">
                    <h3>{__('Feedback Wizard', starterblocks.i18n)}</h3>
                    <button className="starterblocks-modal-close" onClick={onCloseWizard}>
                        <i className={'fas fa-times'}/>
                    </button>
                </div>
                <div className="starterblocks-feedback">
                    <div className="panel">
                        <h4>{__('Thank you for reporting an issue.', starterblocks.i18n)}</h4>
                        <p>{__('We want to make StarterBlocks perfect. Please send whatever you are comfortable sending, and we will do our best to resolve the problem.', starterblocks.i18n)}</p>
                        <div className="field">
                            <input type="checkbox" id="theme_plugins"/>
                            <label htmlFor="theme_plugins">Send theme and plugins</label>
                        </div>
                        <div className="field">
                            <input type="checkbox" id="content"/>
                            <label htmlFor="content">Send page content</label>
                        </div>
                        <div className="field">
                            <label htmlFor="template_id">Template ID</label>
                            <input type="input" id="template_id" disabled="disabled" value="TYPE-hash"/>
                        </div>
                        <button className="button button-primary" onClick={submitFeedback}>
                            {loading ? <i className="fas fa-spinner fa-pulse"/> :
                                <i className="fas fa-share"></i>} Submit Feedback
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
