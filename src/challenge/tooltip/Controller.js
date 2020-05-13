const {Children, cloneElement, createPortal} = wp.element;
const {useState, useEffect, createRef} = wp.element;

export default function Controller(props) {
    const {offsetX, offsetY, children} = props
    const [isOpen, setIsOpen] = useState(false);
    const [style, setStyle] = useState({
        position: 'absolute',
        zIndex: 99999,
        top: 0,
        left: 0
    });
    const tooltipRef = createRef();
    const openMenu = (e) => {
        e.preventDefault();
        setIsOpen(true);
    }
    const closeMenu = (e) => {
        e.preventDefault();
        setIsOpen(false);
    }
    
    const resize = (getElementBounding, selector) => {
        if(offsetX === 'center' || offsetX === 'centre'){
            setStyle({
                ...style,
                left: getElementBounding.left + (getElementBounding.width - style.tooltipWidth)/2,
                top: getElementBounding.top + getElementBounding.height + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0)
            })
        }
        else{
            setStyle({
                ...style,
                left: getElementBounding.left,
                top: getElementBounding.top + getElementBounding.height + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0)
            })
        }
    }
    return Children.map(children, child => {
        if (child.type.name === 'Select')
            return cloneElement(child, {openMenu, closeMenu, resize});
        else
            return (
                isOpen && createPortal(
                    <span onClick={e => e.stopPropagation()} ref={tooltipRef} style={style}>{cloneElement(child)}</span>, 
                    document.body)
            );
    })
}