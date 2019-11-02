let db = null
function connect(callback) {
    // db = window.sqlitePlugin.openDatabase({
    //   name: 'my.db',
    //   location: 'default',
    //   androidDatabaseImplementation: 2
    // });
    //
    // db.transaction(tx => {
    //   tx.executeSql('CREATE TABLE IF NOT EXISTS logs (stdt integer, sec integer, move integer, calorie real)');
    // }, err =>{
    //   console.error(err);
    // }, ()=>{
    //   callback()
    // })
}

export {db, connect}
