import React from 'react';

export default function Landing() {
    return (
        <div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height : "90VH", paddingTop: "110px", backgroundColor: "rgb(246,239,228)" }}>
                <img src="logo.png" style={{ width: "300px" }} />
                <div style={{ fontSize: "50px", paddingTop: "50px" }}>Welcome to <span style={{ color: "#f6eb15", fontWeight: "bold" }}>BNB </span>Shinobi</div>
                <div style={{ fontWeight: "bold", fontSize: "22px", paddingTop: "20px" }}>You are not connected to your wallet!</div>
                <div style={{ paddingTop: "15px" }}>Please connect your wallet to be able to change your reward's token and check your balance</div>
            </div>
        </div>
    );
}


export { Landing };