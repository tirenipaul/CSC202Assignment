import { useCallback, useState } from 'react';
import { DataSource } from 'typeorm/browser';
import { name1655204334428 } from '../../migrations/1655204334428-name';
import { AssetEntry } from '../../modules/asset-entries/entities/asset-entry.entity';
import { TransactionEntry } from '../../modules/transaction-entries/entities/transaction-entry.entity';

const dataSource = new DataSource({
    database: "personal_multi_manager.db",
    driver: require('expo-sqlite'),
    entities: [
        //"src/**/*.entity{.ts,.js}", //Not working. I need to investigate this further.
        //Post,
        //Category,
        //Author,
        AssetEntry,
        TransactionEntry
    ],
    synchronize: true, //set to false in production and migrationRun to true
    type: "expo",
    /*migrations: [
        //'src/global/migrations/*.ts'
        //or specify the module as in entities above
        name1655204334428
    ],
    migrationsRun: true*/

});

//Below is a custom hook that return's react's userCallback call. To be further explained in class
const useSqliteDataSource = async () => {
    const [initializedDataSource, setInitializedDataSource] = useState<DataSource | null >(null)
    const initDataSource = useCallback(async () => {//useCallback is a hook to be explained in class. Meanwhile, look it up online.
        try{
            if(!initializedDataSource){ //first time
                const _initializedDataSource = await dataSource.initialize()
                setInitializedDataSource(_initializedDataSource);
                return _initializedDataSource;
            }else{
                return initializedDataSource; //the one in state
            }
        }catch(error){
            return null;
        }
    }, [])
    return await initDataSource();
}
export default useSqliteDataSource;