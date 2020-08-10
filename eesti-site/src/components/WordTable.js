import React from 'react';
import MaterialTable from 'material-table';
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

            const _data = data.map(
                (row) => ({ ...row, key: row._id, translation: row.translation[0] })
            );

            // create expected columns format
            const _cols = [];
            for (const index in headers) {
                let formattedClmn = { title: headers[index], field: columns[index] };

                if (columns[index] !== 'translation') {
                    formattedClmn.editable = "never";
                }

                if (columns[index] === 'tags') {
                    formattedClmn.render = (rowData) => <WordTags
                        options={tags}
                        selected={rowData.tags}
                        onSubmit={(rowTags) => {
                            rowData.tags = rowTags;
                            updateData(rowData._id, rowTags, null);
                        }}
                    />
                }
                _cols.push(formattedClmn);
            }

            setState({ columns: _cols, data: _data });

            return () => setState({ columns: [], data: [] });

        }, [headers, columns, data, tags, setState, updateData]
    );

    const handleUpdateRequest = React.useCallback((id, cellData) => {
        updateData(id, null, cellData);
    }, [updateData]);

    return (<MaterialTable
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
    />);
}