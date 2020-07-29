import React from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Grid, List, Collapse, IconButton, Button, ListItem, ListItemText, TextField, ListItemIcon, Typography, Tooltip } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';

import request from '../requests/backend-request';

function NewPage() {

    const [state, setState] = React.useState({ alert: { open: false, txt: "", severity: "success" }, data: [] });

    const textInput = React.useRef(null);

    const handleNewWord = React.useCallback(
        (event) => {
            if (event.keyCode === 13) {
                const value = event.target.value;
                if (value) {
                    setState((prev) => ({ ...prev, data: [...prev.data, value] }));
                    setTimeout(() => {
                        textInput.current.value = null;
                    }, 100);
                }
            }
        },
        [setState]);

    const handleSaveClick = React.useCallback((event) => {
        async function saveData() {
            if (state.data.length) {
                let severity, txt;
                try {
                    const response = await request.insertMany(state.data);

                    if (response.data.length) {
                        severity = "warning";
                        txt = "Saved all, except: " + response.data.join();
                    } else {
                        severity = "success";
                        txt = "Successfully saved";
                    }
                } catch (e) {
                    severity = "error";
                    txt = "Failed to save: " + e.message;
                }
                setState({ alert: { open: true, severity: severity, txt: txt }, data: [] });
            }
        }
        saveData();

    }, [state, setState]);

    const renderTable = React.useMemo(() => {
        return state.data.map((row, index) => {
            return (
                <ListItem key={index} >
                    <ListItemIcon><AddCircleOutlineIcon color="primary" /></ListItemIcon>
                    <ListItemText align="left" primary={<Typography variant="body1" color="primary">{row}</Typography>} />
                </ListItem>
            )
        });
    }, [state]);

    return (
        <div>
            <Grid container align="center">
                <Grid item xs={12} >
                    <Tooltip title="press Enter to add new word" placement="right">
                        <TextField
                            inputRef={textInput}
                            label="MA-Infinitive / 1st Case"
                            onKeyDown={handleNewWord} />
                    </Tooltip>
                </Grid>
                <Grid item xs={5} />
                <Grid item xs={7}>
                    <List>{renderTable}</List>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleSaveClick}>Save</Button>
                </Grid>
            </Grid>
            <Collapse in={state.alert.open}>
                <Alert
                    severity={state.alert.severity}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setState((prev) => ({ ...prev, alert: { open: false, txt: "" } }))}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >{state.alert.txt}</Alert>
            </Collapse>
        </div>
    );
}

export default NewPage;