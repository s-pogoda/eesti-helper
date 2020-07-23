import React from 'react';
import { Grid, TextField } from '@material-ui/core';
import TranslationListItem from './TranslationListItem';

export default function QuizField({ id, word, isVerb, onSubmit }) {

    const [state, setState] = React.useState({ id: '', data: { firstCase: '', secondCase: '', thirdCase: '' } });

    const error_first = state.firstCase === '';
    const error_second = state.secondCase === '';
    const error_third = state.thirdCase === '';

    React.useEffect(
        () => {
            setState((prev) => ({ ...prev, id: id }));

            return () => setState({ id: '', data: { firstCase: '', secondCase: '', thirdCase: '' } });

        }, [setState, id]
    );

    const handleOnChange = React.useCallback(
        (event) => {
            const name = event.target.name;
            const value = event.target.value;

            setState((prev) => ({ ...prev, data: { ...prev.data, [name]: value } }));

        }, [setState]
    );

    const handleTabEnterPress = React.useCallback(
        (event) => {
            // 9: Tab key code, 13: Enter key code
            if (event.keyCode === 9 || event.keyCode === 13) {
                if (!error_first && !error_second && !error_third)
                    onSubmit(state);
            }
        }, [error_first, error_second, error_third, state, onSubmit]
    );

    return (
        <Grid container>
            <Grid item xs={3}>
                <TranslationListItem arrayValue={word} />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    required
                    name="firstCase"
                    autoComplete="off"
                    value={state.data.firstCase}
                    label={isVerb ? "MA-Infinitive" : "1st Case"}
                    onChange={handleOnChange}
                    error={error_first}
                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    required
                    name="secondCase"
                    autoComplete="off"
                    value={state.data.secondCase}
                    label={isVerb ? "DA-Infinitive" : "2nd Case"}
                    onChange={handleOnChange}
                    error={error_second}
                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    required
                    name="thirdCase"
                    autoComplete="off"
                    value={state.data.thirdCase}
                    label={isVerb ? "'ME'-form" : "3rd Case"}
                    onChange={handleOnChange}
                    onKeyDown={handleTabEnterPress}
                    error={error_third}
                />
            </Grid>
        </Grid>
    );
}