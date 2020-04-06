import {__} from '@wordpress/i18n';
import {Component, Fragment} from '@wordpress/element';

var onClose, node, customizerNode, wizardNode, tourNode;

export class Modal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			afterOpen: false,
			beforeClose: false,
		}
	}

	close() {
		if (!this.props.onRequestClose || this.props.onRequestClose()) {
            if (wizardNode) ModalManager.closeWizard()
		    else if (customizerNode) ModalManager.closeCustomizer()
            else if (tourNode) ModalManager.closeTour()
            else ModalManager.close()
		}
	}

	handleKeyDown = (event) => {
		if (event.keyCode === 27) {
            if (wizardNode) ModalManager.closeWizard()
		    else if (customizerNode) ModalManager.closeCustomizer()
            else if (tourNode) ModalManager.closeTour()
            else ModalManager.close()
		}
	}

	componentDidMount() {
		const {openTimeoutMS, closeTimeoutMS} = this.props
		document.addEventListener('keydown', this.handleKeyDown)
		setTimeout(() => this.setState({afterOpen: true}), openTimeoutMS ? openTimeoutMS : 150)

		onClose = (callback) => {
			this.setState({beforeClose: true}, () => {
				this.closeTimer = setTimeout(callback, closeTimeoutMS ? closeTimeoutMS : 150)
			});
		};
	}

	componentWillUnmount() {
		onClose = null;
		clearTimeout(this.closeTimer)
		document.removeEventListener('keydown', this.handleKeyDown)
	}

	render() {

		return (
			<Fragment>
				<span onClick={e => {
					this.close()
				}} className={'starterblocks-pagelist-modal-overlay'}>&nbsp;</span>
				<div className={'starterblocks-pagelist-modal-inner'} onClick={e => e.stopPropagation()}>
					{this.props.children}
				</div>
			</Fragment>
		);
	}
}


export const ModalManager = {
	open(component) {
		if (onClose) {
			throw __('There is already one modal.It must be closed before one new modal will be opened');
		}
		if (!node) {
			node = document.createElement('div')
			node.className = 'starterblocks-builder-modal'
			document.body.appendChild(node)
		}
		wp.element.render(component, node)
		document.body.classList.add('starterblocks-builder-modal-open')
	},
	close() {
		onClose && onClose(() => {
			wp.element.unmountComponentAtNode(node)
			document.body.classList.remove('starterblocks-builder-modal-open')
		});
	},
	openCustomizer(component) {
		if (!customizerNode) {
			customizerNode = document.createElement('div');
			document.body.appendChild(customizerNode);
		}
		wp.element.render(component, customizerNode);
	},
	closeCustomizer() {
        if (customizerNode) {
            wp.element.unmountComponentAtNode(customizerNode);
            customizerNode = false
        }
	},
	openWizard(component) {
		if (!wizardNode) {
			wizardNode = document.createElement('div');
			wizardNode.className = 'starterblocks-wizard'
			if (node)
				document.body.insertBefore(wizardNode, node);
		}
		wp.element.render(component, wizardNode);
	},
	closeWizard() {
		if (wizardNode) {
            wp.element.unmountComponentAtNode(wizardNode);
            wizardNode = false;
        }
	},
    openTour(component) {
        if (!tourNode) {
            tourNode = document.createElement('div');
            tourNode.className = 'starterblocks-tour'
            if (node)
                document.body.insertBefore(tourNode, node);
        }
        wp.element.render(component, tourNode);
    },
    closeTour() {
        if (tourNode) {
            wp.element.unmountComponentAtNode(tourNode);
            tourNode = false;
        }
    }
}
