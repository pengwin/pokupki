const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const db = require('./database');

const migrationsFolder = './db_migrations';

function checksum(str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'sha1')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
}

function readFile(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (error, content) => {
            if (error) {
                reject(error);
            } else {
                resolve(content);
            }
        });
    });
}

function readDir(dirName) {
    return new Promise((resolve, reject) => {
        fs.readdir(dirName, (error, files) => {
            if (error) {
                reject(error);
            } else {
                resolve(files);
            }
        });
    });
}

function prepareMigrations() {
    return readDir(migrationsFolder).then(files => {
        let promises = files.map(file => {
            let fileName = path.join(migrationsFolder, file);
            return readFile(fileName).then(content => {
                return { hash: checksum(content), file: fileName, content: content };
            });
        });
        return Promise.all(promises);
    });
}


function createMigrationsTable() {
    return db.query(`
    CREATE TABLE IF NOT EXISTS database_migrations (
        file_name  varchar(1024)                NOT NULL CHECK (file_name <> ''),
        hash       varchar(1024)                NOT NULL CHECK (hash <> ''),
        date       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
    );`)
        .then((res) => console.info('Migration table created'));
}

function addMigration(migration) {
    const query = {
        text: 'INSERT INTO database_migrations(file_name, hash) VALUES($1, $2)',
        values: [migration.file, migration.hash],
    };
    return db.query(query);
}

function applyMigration(migration) {
    return db.query(migration.content).then(x => {
        console.info(`Migration ${migration.file}-${migration.hash} applied`)
        return addMigration(migration).then(() => console.info(`Migration ${migration.file}-${migration.hash} saved`));
    });
}

createMigrationsTable().then(() => {
    return prepareMigrations().then(migrations => {
        console.info('Hashes calculated');
        let promise = Promise.resolve();
        for(let i = 0; i < migrations.length; i++) {
            promise = promise.then(x => applyMigration(migrations[i]));
        }
        return promise.then(() => db.shutdown().then(() => console.info('Db connection pool shutdown')));
    });
});





