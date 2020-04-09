const {__} = wp.i18n;
const {parse} = wp.blocks;
const {compose} = wp.compose;
const {withDispatch, withSelect, select} = wp.data;
const {Component, Fragment, useState, useEffect} = wp.element;
const {Spinner} = wp.components;

import InstallPluginStep from './InstallPluginStep';
import ProPluginStep from './ProPluginsStep';
import {ModalManager} from '../modal-manager'
import './style.scss'

const PLUGIN_STEP = 0;
const PRO_STEP = 1;
const IMPORT_STEP = 2;
const tourPlugins = ['qubely', 'kioken'];
function ImportWizard(props) {
    const {startImportTemplate, setImportingTemplate, isTourOpen, importingTemplate} = props;
    const [currentStep, setCurrentStep] = useState(PLUGIN_STEP);
    const [importing, setImporting] = useState(false);

    useEffect(() => {
        if (importingTemplate) {
            if (importingTemplate && currentStep === PLUGIN_STEP &&
                (!importingTemplate.installDependencies || importingTemplate.installDependencies.length < 1))
                setCurrentStep(PRO_STEP);
            if (importingTemplate && currentStep === PRO_STEP &&
                    (!importingTemplate.proDependencies || importingTemplate.proDependencies.length < 1))
                setCurrentStep(IMPORT_STEP);
            if (importingTemplate && currentStep === IMPORT_STEP && importing === false) {
                setImporting(true);
                startImportTemplate();
            }
        }
    }, [importingTemplate, currentStep])

    const toNextStep = () => {
        if (isTourOpen) return;
        setCurrentStep(currentStep + 1);
    };

    const onCloseWizard = () => {
        if (isTourOpen) return; // When in tour mode, we don't accpet mouse event.
        setCurrentStep(PLUGIN_STEP);
        setImportingTemplate(null);
    };


    if (isTourOpen) {
        // exception handling for tour mode
        if (currentStep !== PLUGIN_STEP) setCurrentStep(PLUGIN_STEP)
    }

    if (!importingTemplate) return null;
    return (
        <div className="starterblocks-import-wizard-overlay">
            <div className="starterblocks-import-wizard-wrapper" data-tut="tour__import_wizard">
                <div className="starterblocks-import-wizard-header">
                    <h3>{__('Template Import Wizard')}</h3>
                    <button className="starterblocks-builder-close-modal" onClick={onCloseWizard}>
                        <i className={'fas fa-times'}/>
                    </button>
                </div>
                {(currentStep === PLUGIN_STEP) &&
                    <InstallPluginStep missingPlugins={isTourOpen ? tourPlugins : importingTemplate.installDependencies || []} toNextStep={toNextStep}
                                   onCloseWizard={onCloseWizard}/>}
                {(currentStep === PRO_STEP) && importingTemplate.proDependencies &&
                    <ProPluginStep missingPros={importingTemplate.proDependencies } onCloseWizard={onCloseWizard}/>}
                {(currentStep === IMPORT_STEP) &&
                    <div className="starterblocks-import-wizard-spinner-wrapper"><Spinner/></div>
                }
            </div>
        </div>
    );
}


export default compose([
    withDispatch((dispatch) => {
        const {setImportingTemplate} = dispatch('starterblocks/sectionslist');
        return {
            setImportingTemplate
        };
    }),

    withSelect((select, props) => {
        const {getTourOpen, getImportingTemplate} = select('starterblocks/sectionslist');
        return {
            isTourOpen: getTourOpen(),
            importingTemplate: getImportingTemplate()
        };
    })
])(ImportWizard);
