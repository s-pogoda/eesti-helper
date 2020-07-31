import React from 'react';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';

import request from '../requests/backend-request';

export default function WordTable({ headers, columns, data }) {

    const [state, setState] = React.useState({ columns: [], data: [] });

    React.useEffect(
        () => {
            // create expected columns format
            const _cols = [];
            for (const index in headers) {
                if (columns[index] === 'translation') {
                    _cols.push({ title: headers[index], field: columns[index] });
                } else {
                    _cols.push({ title: headers[index], field: columns[index], editable: "never" });
                }
            }

            //add only needed data fields 
            const _data = data.map(
                (row) => {
                    const _row = { _id: row._id };
                    columns.map((column) => _row[column] = Array.isArray(row[column]) ? row[column][0] : row[column]);
                    return _row;
                }
            );

            setState({ columns: _cols, data: _data });

            return () => setState({ columns: [], data: [] });

        }, [headers, columns, data, setState]
    );

    const handleUpdateRequest = React.useCallback((updateItem) => {
        async function updateData() {
            try {
                await request.updateTranslation(updateItem._id, updateItem.translation);
            } catch (e) {
                //TODO: add alert
                console.error(e.message);
            }
        }
        updateData();
    }, []);

    const renderTable = React.useMemo(
        () => {
            return (
                <MaterialTable
                    title="Estonian Words"
                    columns={state.columns}
                    data={state.data}
                    editable={{
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, reject) => {

                                setTimeout(() => {
                                    resolve();
                                    if (oldData) {
                                        handleUpdateRequest(newData);
                                        setState((prevState) => {
                                            const data = [...prevState.data];
                                            data[data.indexOf(oldData)] = newData;
                                            return { ...prevState, data };
                                        });
                                    }
                                }, 600);
                            })
                    }}
                ></MaterialTable>);
        }, [state, handleUpdateRequest]
    );

    return (<Typography component="div">{renderTable}</Typography>);

}