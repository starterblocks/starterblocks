const { createContext } = wp.element;
const TemplateModalContext = createContext({});
export const TemplateModalProvider = TemplateModalContext.Provider;
export const TemplateModalConsumer = TemplateModalContext.Consumer;
export default TemplateModalContext;