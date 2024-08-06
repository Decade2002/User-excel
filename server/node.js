import mysql from 'mysql'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
var router = express.Router()
var server = express()
// var query2 ='SELECT guest_id, picture_urls FROM user.reservations'
import db from './config/database.js'

server.use(cors({
    origin: '*'
}))
server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
db.connect(function(err) {
  if (err) throw err;
});

var rollin = 0
var rollin2 = 0
var rollin3 = 0
var tempdata = []
db.query('SELECT * FROM user.userdb', function(error, data) {
    if(error) throw error
    tempdata = data
    console.log(tempdata.length)
    rollin = Math.ceil((tempdata.length / 20) - 1)
})
db.query(`SELECT * FROM user.userdb WHERE full_name IS NULL AND gender IS NULL AND birth_day IS NULL AND place_of_residence IS NULL`, function(error, data) {
    if(error) throw error
    var arr = data
    console.log(arr.length)
    rollin2 = Math.ceil((arr.length / 20) - 1)
})

db.query(`SELECT * FROM user.userdb WHERE full_name IS NOT NULL OR gender IS NOT NULL OR birth_day IS NOT NULL OR place_of_residence IS NOT NULL`, function(error, data) {
    if(error) throw error
    var arr = data
    console.log(arr.length)
    rollin3 = Math.ceil((arr.length / 20) - 1)
})

server.post(`/users/user/:userid`, function(req, res) {
    var text = `UPDATE userdb SET full_name = ?, gender = ?, birth_day = ?, place_of_residence = ? WHERE guest_id = ?`
    var value = [req.body.full_name, req.body.gender, req.body.birth_day, req.body.place_of_residence, req.body.guest_id]
    db.query(text, value)
    console.log(req.body)
    return res.json({
        error: false,
        message: 'OK'
    })
}) 

server.get(`/users`, function(req, res) {
    db.query(`SELECT * FROM user.userdb LIMIT ${req.query.page * 20}, ${req.query.count}`, function(error, data) {
        if(error) throw error
        var arr = data
        // console.log(arr)
        return res.json({
            error: false,
            data: arr,
            pageNumber : rollin,
            message: 'user list'
    })
    })
    console.log(req.params)
    
})
server.get(`/users/unfinished-users`, function(req, res) {
    db.query(`SELECT * FROM user.userdb WHERE full_name IS NULL AND gender IS NULL AND birth_day IS NULL AND place_of_residence IS NULL LIMIT ${req.query.page * 20}, ${req.query.count}`, function(error, data) {
        if(error) throw error
        var arr = data
        console.log()
        return res.json({
            error: false,
            data: arr,
            pageNumber : rollin2,
            message: req.query
    })
    })
})
server.get(`/users/finished-users`, function(req, res) {
    db.query(`SELECT * FROM user.userdb WHERE full_name IS NOT NULL OR gender IS NOT NULL OR birth_day IS NOT NULL OR place_of_residence IS NOT NULL LIMIT ${req.query.page * 20}, ${req.query.count}`, function(error, data) {
        if(error) throw error
        var arr = data
        // console.log(arr)
        return res.json({
            error: false,
            data: arr,
            pageNumber : rollin3,
            message: 'user list'
    })
    })
})
server.post('/users/excel-files', function(req, res) {
    // console.log(req.body)
    var x = 0
    if(req.body.data.guest_id === 'uszzqv1ipx') {
        console.log(req.body.data)
    }
    for(let i = 0; i < tempdata.length; i ++) {
        if(req.body.data.guest_id === tempdata[i].guest_id) {
            x += 1
        }
    }
    console.log(x)
    if(x > 0) {
        if(req.body.data.full_name !== null && req.body.full_name !== '') {
            var text = `UPDATE userdb SET full_name = ? WHERE guest_id = ?`
            var query = [req.body.data.full_name, req.body.data.guest_id]
            db.query(text, query)
        }
        if(req.body.data.gender !== null && req.body.gender !== '') {
            var text = `UPDATE userdb SET gender = ? WHERE guest_id = ?`
            var query = [req.body.data.gender, req.body.data.guest_id]
            db.query(text, query)    
        }
        if(req.body.data.birth_day !== null && req.body.birth_day !== '') {
            var text = `UPDATE userdb SET birth_day = ? WHERE guest_id = ?`
            var query = [req.body.data.birth_day, req.body.data.guest_id]
            db.query(text, query)
        }
        if(req.body.data.place_of_residence !== null && req.body.place_of_residence !== '') {
            var text = `UPDATE userdb SET place_of_residence = ? WHERE guest_id = ?`
            var query = [req.body.data.place_of_residence, req.body.data.guest_id]
            db.query(text, query)
        }
    } else {
        console.log(req.body.data.guest_id)
        var text = `INSERT INTO userdb (guest_id, picture_urls,full_name, gender, birth_day, place_of_residence) VALUES (?, ?, ?, ?, ?, ?)`
        var query = [req.body.data.guest_id, req.body.data.picture_urls, req.body.data.full_name, req.body.data.gender, req.body.data.birth_day, req.body.data.place_of_residence]
        db.query(text, query)
    }
    return res.json({
        error: false,
        message: 'HI'
    })
})
// server.get('/users', function(req, res) {
//     return res.json({
//         error: false,
//         message: 'HI'
//     })
// })
server.listen(3000, function() {
    console.log('start at 3000')
})

