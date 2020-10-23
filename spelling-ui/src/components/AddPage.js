import React from 'react';
import { Grid, Collapse, Typography, Tooltip, Button, TextField } from '@material-ui/core';
import { List, ListItem, ListItemText, ListItemIcon, IconButton } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

import request from '../requests/backend-request';

function NewPage() {

    const [alert, setAlert] = React.useState({ open: false, txt: "", severity: "success" });
    const [data, setData] = React.useState([]);
    const textInput = React.useRef(null);

    const handleNewWord = React.useCallback(
        (event) => {
            if (event.keyCode === 13) {
                const value = event.target.value;
                if (value) {
                    setData((prev) => [...prev, value]);
                    setTimeout(() => {
                        textInput.current.value = null;
                    }, 100);
                }
            }
        },
        [textInput, setData]);

    const handleRemoveItem = React.useCallback(
        (index) => {
            setData((prev) => prev.filter((e, i) => i !== index));
        }, [setData]);

    const handleSaveClick = React.useCallback((event) => {
        async function saveData() {
            if (data.length) {
                const newAlert = { open: true };
                try {
                    const response = await request.insertMany(data);

                    if (response.data.length) {
                        newAlert.severity = "warning";
                        newAlert.txt = "Saved all, except: " + response.data.join();
                    } else {
                        newAlert.severity = "success";
                        newAlert.txt = "Successfully saved";
                    }
                } catch (e) {
                    newAlert.severity = "error";
                    newAlert.txt = "Failed to save: " + e.message;
                }
                setAlert(newAlert);
                setData([]);
            }
        }
        saveData();

    }, [data, setData, setAlert]);

    const renderList = React.useMemo(() =>
        data.map((row, index) =>
            (
                <ListItem key={index} tabIndex={-1} button >
                    <ListItemIcon><AddRoundedIcon color="primary" /></ListItemIcon>
                    <ListItemText align="left" primary={<Typography variant="body1">{row}</Typography>} />
                    <IconButton tabIndex={-1} onClick={() => handleRemoveItem(index)}><DeleteIcon color="primary" /></IconButton>
                </ListItem>

            )), [data, handleRemoveItem])

    return (
        <>
            <Grid container align="center" justify="center">
                <Grid item xs={12} >
                    <Tooltip title="press Enter to add new word" placement="right">
                        <TextField
                            inputRef={textInput}
                            label="MA-Infinitive / 1st Case"
                            onKeyDown={handleNewWord} />
                    </Tooltip>
                </Grid>
                <Grid item xs={3}>
                    <List >{renderList}</List>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleSaveClick}>Save</Button>
                </Grid>
            </Grid>
            <Collapse in={alert.open}>
                <Alert
                    severity={alert.severity}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setAlert((prev) => ({ ...prev, open: false, txt: "" }))}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >{alert.txt}</Alert>
            </Collapse>
        </>
    );
}

export default NewPage;