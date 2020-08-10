import React from 'react';

import { Container, Grid, Button, List, Typography } from '@material-ui/core';
import PreQuiz from './PreQuiz';
import QuizField from './QuizField';
import ResultList from './ResultList';

import request from '../requests/backend-request';

export default function QuizPage() {

    const [event, setEvent] = React.useState("CONFIG");
    const [options, setOptions] = React.useState({ limit: 0, selector: "", type: "", tags: "" });

    const [state, setState] = React.useState({
        words: [],
        answers: {},
        failed: []
    });

    React.useEffect(() => {
        async function getData() {
            try {
                if (options.selector) {
                    const response = await request.find([options.selector, options.limit, options.type, options.tags]);
                    setEvent("QUIZ");
                    setState((prev) => ({ ...prev, words: response.data }));
                }
            } catch (e) {
                console.error(e.message);
            }
        }
        if (event === "CONFIG") {
            getData();
        }

    }, [event, options, setEvent, setState]
    );

    const handleStart = React.useCallback(
        (event) => {
            setOptions(event);
        }, [setOptions]
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
                    setEvent("RESULT");
                    setState((prev) => ({ ...prev, failed: response.data }));
                } catch (e) {
                    console.error(e.message);
                }
            }
            requestResult();

        }, [state, setEvent, setState]
    );

    const generateComponent = React.useMemo(() => {
        switch (event) {
            // Fill quiz words
            case "QUIZ": {
                if (!state.words.length) {
                    return (<Typography variant="body1" color="primary">Request have 0 matches</Typography>);
                }
                return (<Container maxWidth="lg">
                    <List>
                        {state.words.map(
                            (item, index) => {
                                const _isVerb = (item.type === "tegusõna" ? true : false);
                                return <QuizField key={item._id} id={item._id} word={item.translation} isVerb={_isVerb} onSubmit={handleWordSubmit} />
                            }
                        )}
                    </List>
                    <Button variant="contained" color="primary" onClick={handleQuizResult}>Check</Button>
                </Container>);
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
    }, [event, state, handleStart, handleWordSubmit, handleQuizResult]);

    return (
        <>
            {generateComponent}
        </>);
}