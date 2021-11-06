import React from 'react';

export default function RoundText({ children, bcolor, border, padding }) {
    return (
        <div style={{ backgroundColor: bcolor, borderRadius: "15px", fontSize: "12px", padding: padding, border: border, width : "fit-content" }}>
            {children}
        </div>
    );
}


export { RoundText };