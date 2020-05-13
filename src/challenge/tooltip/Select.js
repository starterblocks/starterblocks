const {cloneElement, findDOMNode, createRef, useEffect} = wp.element;

export default function Select({children, openMenu, resize}) {
    const displayName = 'Select';
    const selectedElement = createRef();
    useEffect(() => {
        onResize();
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, [])

    const onResize = () => {
        resize(getElementBounding(), selectedElement);
    };

    const getElementBounding = () => {
        const rect = findDOMNode(selectedElement.current).getBoundingClientRect();
        return {left: rect.left, top: rect.top, width: rect.width, height: rect.height};
    }

    return cloneElement(children, {ref: selectedElement, onClick: openMenu});
}