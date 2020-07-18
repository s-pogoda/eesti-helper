import React from 'react';
import { TextField, Select, MenuItem, Grid, Button, InputLabel } from '@material-ui/core';

export default function AddWord({onSubmit}) {

    const [state, setState] = React.useState({wordType:'', firstCase:'', secondCase:'', thirdCase:'', translation:''});
    // const selectRef = React.useRef();

    const handleChange = React.useCallback(
        (event, fieldName) => {
            const value = event.target.value;
            setState((prev) => ({...prev, [fieldName]: value}));
        },
        [setState]
    );

    const handleClick = (event) => {
        onSubmit(state);
    };
    
    return (
        <Grid container alignItems="center" spacing={0}>
            <Grid item xs={2}>
                <InputLabel>Word type</InputLabel>
                <Select fullWidth value={state.wordType} onChange={(e) => handleChange(e, 'wordType')}>
                    <MenuItem value="tegusõna">verb</MenuItem>
                    <MenuItem value="nimisõna">noun</MenuItem>
                    <MenuItem value="omadussõna">adjective</MenuItem>
                    <MenuItem value="asesõna">pronoun</MenuItem>
                </Select>
            </Grid>
            <Grid item xs={2} >
                <InputLabel>MA-infinitive / 1st Case</InputLabel>
                <TextField onChange={(e) => handleChange(e, 'firstCase')} value={state.firstCase}/>
            </Grid>
            <Grid item xs={2} >
                <InputLabel>DA-infinitive / 2nd Case</InputLabel>
                <TextField onChange={(e) => handleChange(e, 'secondCase')} value={state.secondCase}/>
            </Grid>
            <Grid item xs={2} >
                <InputLabel>"Me" form / 3rd Case</InputLabel>
                <TextField onChange={(e) => handleChange(e, 'thirdCase')} value={state.thirdCase}/>
            </Grid>
            <Grid item xs={2} >
                <InputLabel>Translation</InputLabel>
                <TextField onChange={(e) => handleChange(e, 'translation')} value={state.translation}/>
            </Grid>
            <Grid item xs={2}>
                <Button variant="contained" color="primary" onClick={handleClick}>Add</Button>
            </Grid>
        </Grid>);
}
