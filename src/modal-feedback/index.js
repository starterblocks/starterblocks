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
                'description': description
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
                        <div className="field">
                            <label>Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <button className="button button-primary" onClick={submitFeedback}>
                            {loading ? <i className="fas fa-spinner fa-pulse"/> : <i className="fas fa-share"></i>} Submit Feedback
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
