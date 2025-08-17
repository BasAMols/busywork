import { Busywork } from './game';

document.addEventListener("DOMContentLoaded", async () => {

    if (location.hostname !== 'localhost') {
        const base = document.createElement('base');
        base.href = "https://basamols.github.io/busywork/dist/";
        document.head.appendChild(base);
    }

    const g = new Busywork();
    g.run();
    document.body.appendChild(g.dom);
    
    window.oncontextmenu = function (event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    };
});