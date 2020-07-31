import React from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { Button, TextField, ListItemText, ListItem, Select, MenuItem } from '@material-ui/core';

export default function PreQuiz({ onSubmit }) {

    const [state, setState] = React.useState({ limit: 20, selector: "latest", type: "tegusõna" });

    const handleRadioChange = React.useCallback(
        (event) => {
            const value = event.target.value;
            setState((prev) => ({ ...prev, selector: value }));
        }, [setState]
    );

    const handleLimitChange = React.useCallback(
        (event) => {
            const value = event.target.value;
            setState((prev) => ({ ...prev, limit: value }));

        }, []
    );

    const handleClick = React.useCallback(
        (event) => {
            onSubmit(state);
        }, [state, onSubmit]
    );

    const handleWordTypeChange = React.useCallback(
        (event) => {
            const value = event.target.value;
            setState((prev) => ({ ...prev, type: value }));
        }, [setState]);

    return (
        <Box>
            <Typography variant="h3" color="primary">
                Choose words for quiz
            </Typography>
            <RadioGroup value={state.selector} onChange={handleRadioChange} defaultValue="latest">
                <FormControlLabel
                    value="latest"
                    control={<Radio color="primary" />}
                    label={
                        <ListItem>
                            <ListItemText primary="latest" />
                            <TextField
                                value={state.limit}
                                onChange={handleLimitChange}
                                size="small"
                                type="number"
                                style={{ width: 80, marginRight: 5, marginLeft: 5 }}
                            />
                            <ListItemText primary="learned words" />
                        </ListItem>
                    }
                />
                <FormControlLabel
                    value="failed"
                    control={<Radio color="primary" />}
                    label={<ListItem><ListItemText primary="with failed before words" /></ListItem>} 
                />
                <FormControlLabel
                    value="word-type"
                    control={<Radio color="primary" />}
                    label={
                        <ListItem>
                            <ListItemText primary="all" />
                            <Select
                                value={state.type}
                                onChange={handleWordTypeChange}
                                style={{ width: 100,marginRight: 5, marginLeft: 5 }}
                            >
                                <MenuItem value="tegusõna">verb</MenuItem>
                                <MenuItem value="nimisõna">noun</MenuItem>
                                <MenuItem value="omadussõna">adjective</MenuItem>
                            </Select>
                            <ListItemText primary="words" />
                        </ListItem>
                    } />
            </RadioGroup>
            <Button variant="contained" color="primary" onClick={handleClick}>Start</Button>
        </Box>
    );
}