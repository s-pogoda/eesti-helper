import React from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Button, TextField, ListItemText, ListItem } from '@material-ui/core';

export default function PreQuiz({ onSubmit }) {

    const [state, setState] = React.useState({ limit: 20, type: "" });

    const handleRadioChange = React.useCallback(
        (event) => {
            const value = event.target.value;
            setState((prev) => ({ ...prev, type: value }));
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

    return (
        <Box>
            <Typography variant="h3" color="primary">
                Choose words for quiz
            </Typography>
            <RadioGroup value={state.type} onChange={handleRadioChange} defaultValue="latest">
                <FormControlLabel
                    value="latest"
                    control={<Radio color="primary" />}
                    label={
                        <ListItem>
                            <TextField
                                value={state.limit}
                                onChange={handleLimitChange}
                                size="small"
                                type="number"
                                style={{ width: 80, marginRight: 5 }}
                                variant="outlined"
                            />
                            <ListItemText primary="latest learned words" />
                        </ListItem>
                    }
                />
                <FormControlLabel value="failed" control={<Radio color="primary" />} label="with failed before words" />
            </RadioGroup>
            <Button variant="contained" color="primary" onClick={handleClick}>Start</Button>
        </Box>
    );
}