import React from 'react';

import { Grid, Button, List, Typography } from '@material-ui/core';
import PreQuiz from './PreQuiz';
import QuizField from './QuizField';
import ResultList from './ResultList';

import request from '../requests/backend-request';

export default function QuizPage() {

    const [state, setState] = React.useState({
        event: "CONFIG",
        reqOpts: { limit: 0, type: "" },
        words: [],
        answers: {},
        failed: []
    });

    React.useEffect(() => {
        async function getData() {
            try {
                if (state.reqOpts.type) {
                    const response = await request.find([state.reqOpts.type, state.reqOpts.limit]);
                    setState((prev) => ({ ...prev, event: "QUIZ", words: response.data }));
                }
            } catch (e) {
                console.error(e.message);
            }
        }
        if (state.event === "CONFIG") {
            getData();
        }

    }, [state.event, state.reqOpts, setState]
    );

    const handleStart = React.useCallback(
        (event) => {
            setState((prev) => ({ ...prev, reqOpts: event }));
        }, [setState]
    );

    const handleWordSubmit = React.useCallback(
        (quizField) => {
            setState((prev) => ({ ...prev, answers: { ...prev.answers, [quizField.id]: quizField.data } }));

        }, [setState]
    );

    const handleQuizResult = React.useCallback(
        (event) => {
            async function requestResult() {
                try {
                    const response = await request.quizResult(state.words, state.answers);
                    setState((prev) => ({ ...prev, event: "RESULT", failed: response.data }));
                } catch (e) {
                    console.error(e.message);
                }
            }
            requestResult();

        }, [state, setState]
    );

    const generateComponent = React.useMemo(() => {
        switch (state.event) {
            // Fill quiz words
            case "QUIZ": {
                if (!state.words.length) {
                    return (<Typography variant="h3" color="primary">Request have 0 matches</Typography>);
                }
                return (<Typography component="div">
                    <List>
                        {state.words.map(
                            (item, index) => {
                                const _isVerb = (item.type === "tegusõna" ? true : false);
                                return <QuizField key={item._id} id={item._id} word={item.translation} isVerb={_isVerb} onSubmit={handleWordSubmit} />
                            }
                        )}
                    </List>
                    <Button variant="contained" color="primary" onClick={handleQuizResult}>Check</Button>
                </Typography>);
            }

            // Show quiz result
            case "RESULT": {
                const passed = state.words.length - state.failed.length;

                return (<Grid container align="center" >
                    <Grid item xs={12}>
                        <Typography variant="h2" color="primary">
                            {passed} / {state.words.length}
                        </Typography>
                    </Grid>
                    {passed === state.words.length ?
                        <Grid item xs={12}>
                            <Typography variant="h2" color="primary">Good work!</Typography>
                        </Grid>
                        : <ResultList words={state.failed} answers={state.answers} />}
                </Grid>);
            }

            // Pre-quiz condition
            default: {
                return (<PreQuiz onSubmit={handleStart}></PreQuiz>);
            }
        }
    }, [state, handleStart, handleWordSubmit, handleQuizResult]);

    return (
        <Typography component="div">
            {generateComponent}
        </Typography>);
}