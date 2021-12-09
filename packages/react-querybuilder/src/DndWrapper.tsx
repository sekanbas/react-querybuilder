import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function DnDWrapper(props : {
    enable: boolean,
    children: JSX.Element
}) : JSX.Element {
    if (props.enable) {
        return <DndProvider backend={HTML5Backend}>{props.children}</DndProvider>
    } else {
        return props.children;
    }
}

export default DnDWrapper
