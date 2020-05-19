const {__} = wp.i18n;
const {compose} = wp.compose;
const {withDispatch, withSelect} = wp.data;
const {useState, useEffect} = wp.element;

import InstallPluginStep from './InstallPluginStep';
import ProPluginStep from './ProPluginsStep';
import ImportingStep from './ImportingStep';
import '../modals.scss'
import './style.scss'

const PRO_STEP = 0;
const PLUGIN_STEP = 1;
const IMPORT_STEP = 2;
const tourPlugins = ['qubely', 'kioken-blocks'];
import {requiresInstall, requiresPro} from '~starterblocks/stores/dependencyHelper'
function ImportWizard(props) {
    const {startImportTemplate, setImportingTemplate, isChallengeOpen, importingTemplate} = props;
    const [currentStep, setCurrentStep] = useState(PRO_STEP);
    const [importing, setImporting] = useState(false);

    useEffect(() => {
        if (importingTemplate) {
            if (importingTemplate && currentStep === PRO_STEP && requiresPro(importingTemplate) === false)
                setCurrentStep(PLUGIN_STEP);
            if (importingTemplate && currentStep === PLUGIN_STEP && requiresInstall(importingTemplate) === false)
                setCurrentStep(IMPORT_STEP);
            if (importingTemplate && currentStep === IMPORT_STEP && importing === false) {
                setImporting(true);
                try {
                    startImportTemplate();
                } catch (e) {
                    console.log('importing exception', e);
                    setImporting(false);
                    setCurrentStep(PLUGIN_STEP);
                    setImportingTemplate(null);
                }
            }
        }
    }, [importingTemplate, currentStep])

    const toNextStep = () => {
        if (isChallengeOpen) return;
        setCurrentStep(currentStep + 1);
    };

    const onCloseWizard = () => {
        if (isChallengeOpen) return; // When in tour mode, we don't accpet mouse event.
        if (importing) return;
        setCurrentStep(PLUGIN_STEP);
        setImportingTemplate(null);
    };


    if (isChallengeOpen) {
        // exception handling for tour mode
        if (currentStep !== PLUGIN_STEP) setCurrentStep(PLUGIN_STEP)
    }

    if (!importingTemplate) return null;
    return (
        <div className="starterblocks-modal-overlay">
            <div className="starterblocks-modal-wrapper" data-tut="tour__import_wizard">
                <div className="starterblocks-modal-header">
                    <h3>{__('Template Import Wizard', starterblocks.i18n)}</h3>
                    <button className="starterblocks-modal-close" onClick={onCloseWizard}>
                        <i className={'fas fa-times'}/>
                    </button>
                </div>
                <div className="starterblocks-importmodal-content">
                    {(currentStep === PLUGIN_STEP) &&
                        <InstallPluginStep missingPlugins={isChallengeOpen ? tourPlugins : importingTemplate.installDependenciesMissing || []} toNextStep={toNextStep}
                        onCloseWizard={onCloseWizard}/>}
                    {(currentStep === PRO_STEP) && requiresPro(importingTemplate) &&
                        <ProPluginStep missingPros={importingTemplate.proDependenciesMissing } onCloseWizard={onCloseWizard}/>}
                    {(currentStep === IMPORT_STEP) &&
                        <ImportingStep />
                    }
                </div>
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
        const {getChallengeOpen, getImportingTemplate} = select('starterblocks/sectionslist');
        return {
            isChallengeOpen: getChallengeOpen(),
            importingTemplate: getImportingTemplate()
        };
    })
])(ImportWizard);
