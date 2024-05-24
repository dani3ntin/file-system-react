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

    function handleClickSuRinomina(){
        props.premutoSuOpzioneMenuTastoDestro("rinomina");
    }

    function handleClickSuTaglia(){
        props.premutoSuOpzioneMenuTastoDestro("taglia");
    }

    function handleClickSuCopia(){
        props.premutoSuOpzioneMenuTastoDestro("copia");
    }

    function handleClickSuElimina(){
        props.premutoSuOpzioneMenuTastoDestro("elimina");
    }

    return (
        <div ref={menuRef} className="menu-tasto-destro" style={{ top: props.y + 10, left: props.x + 10 }}>
            <ul>
                <li onClick={handleClickSuRinomina}>Rinomina</li>
                <li onClick={handleClickSuTaglia}>Taglia</li>
                <li onClick={handleClickSuCopia}>Copia</li>
                <li onClick={handleClickSuElimina}>Elimina</li>
            </ul>
        </div>
    );
}

export default MenuTastoDestro;
