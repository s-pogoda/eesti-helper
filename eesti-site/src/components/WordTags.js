import React from 'react';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function WordTags({ options, selected, onSubmit }) {

    const handleOnChange = React.useCallback(
        (event, value) => onSubmit(value), [onSubmit]);

    return (
        <Autocomplete
            multiple
            freeSolo
            options={options}
            defaultValue={selected}
            onChange={handleOnChange}
            ChipProps={{ color: "primary", variant: "outlined" }}

            renderInput={(params) => <TextField {...params} variant="standard" />}
        />
    );
}