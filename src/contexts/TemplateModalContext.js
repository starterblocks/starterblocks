import { createContext } from '@wordpress/element';
const TemplateModalContext = createContext({});
export const TemplateModalProvider = TemplateModalContext.Provider;
export const TemplateModalConsumer = TemplateModalContext.Consumer;
export default TemplateModalContext;
