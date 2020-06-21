import Dexie from 'dexie'

const db = new Dexie('rteach')
db.version(1).stores({
  feedback: '++id,fid,time'
})

export default db