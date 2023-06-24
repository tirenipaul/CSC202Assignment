import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Badge, Icon, Text } from '@rneui/base';
import { ITransactionEntry } from '../../types/definitions';
import { Table, Row, Cell } from 'react-native-table-component';
import {printToFileAsync, } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { deleteAsync } from 'expo-file-system';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { showDeleteConfirmation } from '../../../../global/tools/show-alert';
import { TransactionEntryContext } from '../../contexts/Contexts';

type Props = {
    entries: ITransactionEntry[] //array of entries
}

const Spreadsheet: React.FC<Props> = ({ entries }) => {

    const navigation = useNavigation();

    const [table, setTable] = useState<{ headers: string[], rows: any[], widthArr: number[] } | null>(null);

    const transactionEntryContext = useContext(TransactionEntryContext);

    const { deleteEntry } = transactionEntryContext!

    const makeTable = () => {

        //strip off id before sharing
        const entriesToShare = entries.map((entry, key) => {
            //const { id, ...restOfEntry } = entry;
            //putting serial number first
            const entryWithSerialNumber = { SN: key + 1 } as unknown as ITransactionEntry
            Object.assign(entryWithSerialNumber, entry)
            return entryWithSerialNumber;
        })

        //prepare tabulation headers and rows
        const table = {
            //Below works but I prefer to group the dates for display
            /*headers: Object.keys(entriesToShare[0]),
            rows: entriesToShare.map((entry) => {
                return Object.values(entry)
            }),*/
            headers: entriesToShare.length > 0? ["", "S/N", "Date", "Description", "Amount", "Expense?"] : [],//first empty space is for id in row which is not shown but kept for reference
            rows: entriesToShare.map((entry) => {
                return [entry.id, entry.SN, moment([entry.txnYear!, entry.txnMonth!, entry.txnDay!]).format("LL"), entry.description, new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(entry.amount), entry.expense ? 'Yes' : 'No']
            }),

            widthArr: [0, 40, 70, 120, 100, 80]//first space is for the sake of id which is not shown
        };
        setTable(table);

    }
    useEffect(() => {
        makeTable();
    }, [entries])

    const tableView = () => (

        <View style={styles.container}>
            {
                table &&
                <ScrollView horizontal={true}>
                    <Table borderStyle={styles.cellBorders}>
                        <Row data={table.headers} widthArr={table.widthArr} style={styles.head} textStyle={styles.text} />
                        <ScrollView>
                            {/*<Rows data={table.rows} widthArr={table.widthArr} textStyle={styles.text} /> // This works but breaking down the rows below so as to wrap each row in touchable opacity*/}
                            {
                                table.rows.map((rowData, index) => {
                                    return (
                                        
                                            <TouchableOpacity key={index} style={styles.row}  onPress={() => navigation.navigate("EditEntryScreen" as never, { transactionEntryToEdit: entries.find((entry, index) => entry.id === rowData[0]) } as never)}>
                                                <TouchableOpacity onPress={
                                                    () => {
                                                        //deleteEntry(item.id!)
                                                        showDeleteConfirmation(
                                                            "About to Delete",
                                                            "Are you sure that you want to delete this entry?",
                                                            rowData[0],
                                                            deleteEntry
                                                        )
                                                    }}>

                                                    <Cell data='❌' textStyle={[styles.text, { textAlign: 'center', paddingTop: 9, color: 'red', fontSize: 10, opacity: .7 }]} width={33} borderStyle={styles.cellBorders} />

                                                </TouchableOpacity>
                                                {

                                                    rowData.map((cellData: string, cellIndex: number) =>
                                                    (
                                                        
                                                            cellIndex != 0 && //only show cell is it is not id 0 which is used for id
                                                                <Cell key={cellIndex} data={cellData} textStyle={styles.text} width={table.widthArr[cellIndex]} borderStyle={styles.cellBorders} />
                                                            
                                                        
                                                    ))

                                                }
                                            </TouchableOpacity>
                                       

                                    )
                                })
                            }
                        </ScrollView>
                    </Table>
                </ScrollView>
            }

        </View>
    )

    const pdfShare = async () => {
        const html =
            `<html>
            <body>
                <table>
                    <caption>Personal Transactions</caption>
                    <thead>
                        <tr>
                            ${table!.headers.map((header) => `<th>${header}</th>`)}
                        </tr>
                    </thead>
                    <tbody>
                        ${table!.rows.map((row) => {
                return `<tr>
                                ${row.map((cell: string) => `<td>${cell}</td>`)}
                            </tr>`
            })}
                    </tbody>
                </table>
            </body>
    </html>`
        //console.log(html);
        // On iOS/android prints the given html. On web prints the HTML from the current page.
        const { uri } = await printToFileAsync({
            html,
            base64: false
        });
        //console.log('File has been saved to:', uri);
        await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        await deleteAsync(uri);//clear from cache.
    }

    return (
        <View style={styles.container}>
            <View style={[styles.inputContainerStyle, { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: "lightblue" }]}>
                <Text h3>Entries found... <Badge status="primary" value={entries.length} /></Text>
                <TouchableOpacity
                    style={{ height: 20, top: -9 }}
                    onPress={pdfShare}>
                    <Icon
                        name="share"
                        color="green"
                        size={15}
                        raised={true}
                    />
                </TouchableOpacity>

            </View>
            {
                tableView()
            }

        </View>
    )
}

Spreadsheet.defaultProps = {
    entries: []
}

export default Spreadsheet;

const styles = StyleSheet.create({
    title: { fontSize: 16, color: 'black' },
    container: { flex: 1, paddingTop: 1 },
    head: { height: 40, backgroundColor: '#f1f8ff', width: '100%' },
    row: { flexDirection: 'row', backgroundColor: 'skyblue', borderWidth: 1, borderColor: 'lightblue' },
    text: { padding: 6 },
    wrapper: { flexDirection: 'row' },
    inputContainerStyle: {
        width: '100%',
        padding: 6
    },
    cellBorders: {
        borderWidth: 1, borderColor: 'lightblue', height: '100%'
    }
});