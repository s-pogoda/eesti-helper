import React from 'react';
import { Grid, TextField } from '@material-ui/core';
import TranslationListItem from './TranslationListItem';

export default function QuizField({ id, word, isVerb, onSubmit }) {

    const [state, setState] = React.useState({ id: '', data: { firstCase: '', secondCase: '', thirdCase: '' } });

    const { errorFirst, errorSecond, errorThird } = React.useMemo(() => ({
        errorFirst: state.data.firstCase === '',
        errorSecond: state.data.secondCase === '',
        errorThird: state.data.thirdCase === ''
    }), [state.data]);

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

    const handleOnBlur = React.useCallback(
        (event) => {
            if (!errorFirst && !errorSecond && !errorThird) {
                onSubmit(state);
            }
        }, [errorFirst, errorSecond, errorThird, state, onSubmit]
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
                    onBlur={handleOnBlur}
                    error={errorFirst}
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
                    onBlur={handleOnBlur}
                    error={errorSecond}
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
                    onBlur={handleOnBlur}
                    error={errorThird}
                />
            </Grid>
        </Grid>
    );
}