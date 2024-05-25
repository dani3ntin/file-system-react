import React, { useEffect, useRef } from "react";
import './MenuTastoDestro.css'; // Importa il foglio di stile per il menu

function MenuTastoDestro(props: any): JSX.Element {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                props.chiudiMenu();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef, props]);

    function handleChiudiMenu() {
        props.chiudiMenu();
    }

    function handleClick(azione: string){
        props.premutoSuOpzioneMenuTastoDestro(azione);
    }

    return (
        <div ref={menuRef} className="menu-tasto-destro" style={{ top: props.y + 10, left: props.x + 10 }}>
            <ul>
                <li onClick={() => handleClick("rinomina")}>Rinomina</li>
                <li onClick={() => handleClick("taglia")}>Taglia</li>
                <li onClick={() => handleClick("copia")}>Copia</li>
                {
                    props.elementoCopiato !== null ?
                    <li onClick={() => handleClick("incolla")}>Incolla</li>
                    : null
                }
                <li onClick={() => handleClick("elimina")}>Elimina</li>
            </ul>
        </div>
    );
}

export default MenuTastoDestro;
