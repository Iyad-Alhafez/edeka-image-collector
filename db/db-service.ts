import * as SQLite from 'expo-sqlite';
import { SQLiteDatabase } from 'expo-sqlite';
import uuid from 'react-native-uuid';
import { ImageItem } from '../models';

const tableName = 'imagesTable';

export const getDBConnection = async () => {
  return await SQLite.openDatabaseAsync('images-data');
};

export const createTable = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${tableName} (imageId TEXT PRIMARY KEY NOT NULL, productId TEXT, imageNo INTEGER, imageUri TEXT);
  `);
};

export const deleteTable = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    DROP TABLE IF EXISTS ${tableName}
  `);
};

export const createDummyData = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    INSERT INTO ${tableName} (imageId, productId, imageNo, imageUri) VALUES ('img00', 'pro00', 1, 'dgsdgsgffdgdsfg');
    INSERT INTO ${tableName} (imageId, productId, imageNo, imageUri) VALUES ('img01', 'pro00', 2, '43543543t34t34t');
    INSERT INTO ${tableName} (imageId, productId, imageNo, imageUri) VALUES ('img02', 'pro01', 1, 'fewfwef3232432f');
  `);
};

// export const getImageItems = async (db: SQLiteDatabase) => {
export const getImageItems = async (db: SQLiteDatabase): Promise<ImageItem[]> => {
  return await db.getAllAsync(`SELECT * FROM ${tableName}`);
};

export const saveImageItem = async (db: SQLiteDatabase, productId: string, imageNo: number, imageUri: string) => {
  await db.runAsync(`INSERT INTO ${tableName} (imageId, productId, imageNo, imageUri) VALUES ('${uuid.v4()}', '${productId}', ${imageNo}, '${imageUri}')`);
  // await db.execAsync(`INSERT INTO ${tableName} (imageId, imageUri) VALUES ('${uuid.v4()}', '${imageUri}')`);
};

// export const deleteImageItem = async (db: SQLiteDatabase, id: number) => {
//     const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
//     await db.executeSql(deleteQuery);
// };