import React from 'react';
import { Box, Paper } from '@mui/material';
import './style.scss';

export default function DashPaper({ children, title, width, detail, border }) {
    return (
        <Paper elevation={5} sx={{ padding: "20px 10px", marginTop: "5px", width: width }} className={width ? "dashpaper" : ""}>
            <Box sx={{ paddingBottom: "5px", color: "rgb(59,59,59)" }}>{title}</Box>
            <Box style={{ borderRadius: "15px", fontSize: "12px", padding: "3px 6px", border: border && "solid 1px grey", width: "fit-content" }}>
                {detail}
            </Box>
            {children}
        </Paper>
    );
}


export { DashPaper };