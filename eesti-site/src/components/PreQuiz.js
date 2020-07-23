import React from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Button } from '@material-ui/core';

export default function PreQuiz({ onSubmit }) {

    const [state, setState] = React.useState("");

    const handleChange = React.useCallback(
        (event) => {
            const value = event.target.value;
            setState(value);
        }, [setState]);

    const handleClick = (event) => {
        onSubmit(state);
    };

    return (
        <Box>
            <Typography variant="h3" color="primary">
                Choose words for quiz
            </Typography>
            <RadioGroup value={state} onChange={handleChange} defaultValue="latest">
                <FormControlLabel value="latest" control={<Radio color="primary" />} label="with latest learned words" />
                <FormControlLabel value="failed" control={<Radio color="primary" />} label="with failed before words" />
            </RadioGroup>
            <Button variant="contained" color="primary" onClick={handleClick}>Start</Button>
        </Box>
    );
}