import React from 'react';
import { RadioGroup, FormControlLabel, Radio, Container } from '@material-ui/core';
import { Button, TextField, ListItemText, ListItem, Select, MenuItem } from '@material-ui/core';

import request from '../requests/backend-request';

export default function PreQuiz({ onSubmit }) {

    const [tags, setTags] = React.useState([]);

    const [state, setState] = React.useState({ limit: 20, selector: "latest", type: "all", tags: "" });

    React.useEffect(
        () => {
            async function loadTags() {
                const tags = await request.findTags();
                setTags(tags.data);
            }
            loadTags();

            return () => setTags([]);
        }, [setTags]);

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

    const handleTagsChange = React.useCallback(
        (event) => {
            const value = event.target.value;
            setState((prev) => ({ ...prev, tags: value }));

        }, [setState]);

    const renderTagsSelector = React.useMemo(
        () => {
            console.log(tags);
            return (
                <Select
                    value={state.tags}
                    onChange={handleTagsChange}
                    style={{ width: 100, marginRight: 10, marginLeft: 10 }}
                >
                    {tags.map((tag, index) => (<MenuItem key={index} value={tag}>{tag}</MenuItem>))}
                </Select>)
        }, [tags, state.tags, handleTagsChange]);

    return (
        <Container maxWidth="xs" align="center">
            <RadioGroup value={state.selector} onChange={handleRadioChange} defaultValue="latest">
                <FormControlLabel
                    value="latest"
                    control={<Radio color="primary" />}
                    label={
                        <ListItem >
                            <ListItemText primary="Latest" />
                            <TextField
                                value={state.limit}
                                onChange={handleLimitChange}
                                size="small"
                                type="number"
                                style={{ width: 80, marginRight: 10, marginLeft: 10 }}
                            />
                            <Select
                                value={state.type}
                                onChange={handleWordTypeChange}
                                style={{ width: 100, marginRight: 10, marginLeft: 10 }}
                            >
                                <MenuItem value="all">all</MenuItem>
                                <MenuItem value="tegusõna">verb</MenuItem>
                                <MenuItem value="nimisõna">noun</MenuItem>
                                <MenuItem value="omadussõna">adjective</MenuItem>
                            </Select>
                            <ListItemText primary="words." />
                        </ListItem>
                    }
                />
                <FormControlLabel
                    value="failed"
                    control={<Radio color="primary" />}
                    label={<ListItem><ListItemText primary="Failed before words." /></ListItem>}
                />
                <FormControlLabel
                    value="tags"
                    control={<Radio color="primary" />}
                    label={
                        <ListItem >
                            <ListItemText primary="All with tag" />
                            {renderTagsSelector}
                        </ListItem>
                    }
                />
            </RadioGroup>
            <Button
                variant="contained"
                color="primary"
                style={{ marginTop: 10 }}
                onClick={handleClick}>Start</Button>
        </Container>
    );
}