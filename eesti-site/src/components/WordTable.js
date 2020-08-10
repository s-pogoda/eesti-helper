import React from 'react';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';
import WordTags from './WordTags';

import request from '../requests/backend-request';

export default function WordTable({ headers, columns, data, tags }) {

    const [state, setState] = React.useState({ columns: [], data: [] });

    const updateData = React.useCallback((async (id, tags, translation) => {
        try {
            await request.updateTableRow(id, tags, translation);
        } catch (e) {
            //TODO: add alert
            console.error(e.message);
        }
    }), []);

    React.useEffect(
        () => {
            // create expected columns format
            const _cols = [];
            for (const index in headers) {
                if (columns[index] === 'tags') {
                    _cols.push({
                        title: headers[index],
                        field: columns[index],
                        editable: "never",
                        render: rowData => <WordTags
                            tagsList={tags}
                            selected={rowData.tags ? rowData.tags : []}
                            onSubmit={(rowTags) => {
                                rowData.tags = rowTags;
                                updateData(rowData._id, rowTags, null);
                            }} />
                    });
                } else {
                    if (columns[index] === 'translation') {
                        _cols.push({ title: headers[index], field: columns[index] });
                    } else {
                        _cols.push({ title: headers[index], field: columns[index], editable: "never" });
                    }
                }
            }

            //add only needed data fields 
            const _data = data.map(
                (row) => ({ ...row, translation: row.translation[0] })
            );

            setState({ columns: _cols, data: _data });

            return () => setState({ columns: [], data: [] });

        }, [headers, columns, data, tags, setState, updateData]
    );

    const handleUpdateRequest = React.useCallback((id, cellData) => {
        updateData(id, null, cellData);
    }, [updateData]);

    const renderTable = React.useMemo(
        () => {
            return (
                <MaterialTable
                    title="Estonian Words"
                    columns={state.columns}
                    data={state.data}
                    cellEditable={{
                        onCellEditApproved: (newData, oldData, rowData, columnDef) =>
                            new Promise((resolve, reject) => {

                                setTimeout(() => {
                                    resolve();
                                    if (oldData !== newData) {
                                        handleUpdateRequest(rowData._id, newData);
                                        setState((prevState) => {
                                            const data = [...prevState.data];
                                            data[data.indexOf(rowData)][columnDef.field] = newData;
                                            return { ...prevState, data };
                                        });
                                    }
                                }, 600);
                            })
                    }}
                    options={{
                        headerStyle: {
                            fontWeight: "bold"
                        }
                    }}
                ></MaterialTable>);
        }, [state, handleUpdateRequest]
    );

    return (<Typography component="div">{renderTable}</Typography>);

}