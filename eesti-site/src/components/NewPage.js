import React from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Grid, List, Button, Snackbar, ListItem, ListItemText, TextField, ListItemIcon, Typography } from '@material-ui/core';

import request from '../requests/backend-request';

function NewPage() {

    const [words, setWords] = React.useState([]);

    const textInput = React.useRef(null);

    const handleNewWord = React.useCallback(
        (event) => {
            if (event.keyCode === 13) {
                const value = event.target.value;
                setWords((prev) => [...prev, value]);
                setTimeout(() => {
                    textInput.current.value = null;
                }, 300);
            }
        },
        [setWords]);

    const handleSaveClick = React.useCallback((event) => {
        try {
            request.insertMany(words);
            setWords([]);
        } catch (e) {
            console.error(e.message);
        }
    }, [words, setWords]);

    const renderTable = React.useMemo(() => {
        return words.map((row, index) => {
            return (
                <ListItem key={index}>
                    <ListItemIcon><AddCircleOutlineIcon color="primary" /></ListItemIcon>
                    <ListItemText align="left" primary={<Typography variant="body1" color="primary">{row}</Typography>} />
                </ListItem>
            )
        });
    }, [words]);

    return (
        <div>
            <Grid container>
                <Grid item xs={12}>
                    <TextField inputRef={textInput} label="MA-Infinitive / 1st Case" onKeyDown={handleNewWord} />
                </Grid>
                <Grid item xs={12}>
                    <List>{renderTable}</List>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleSaveClick}>Save</Button>
                </Grid>
            </Grid>
            <Snackbar></Snackbar>
        </div>
    );
}

export default NewPage;