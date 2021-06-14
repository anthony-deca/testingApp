const express = require('express');
const Users = require('./model');
const generateCSVFiles = require('./csvGen').generateCSVFiles;


async function createUsers(req, res, next) {
    try {
    let { email, firstName, lastName } = req.body;
    const obj = { email, firstName, lastName }

    Object.entries(obj).forEach(([key, value]) => {
            if (!value) errors.push(`${key} is required`)
    });
    
    const userRequest = await new Users(obj).save();
    await generateCSVFiles();
    res.status(201).json({ status: 'Success', data: userRequest })
    
} catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
}
    
}

// async function getUsersByLimit(limit, skip) {
//     try {
//     const request = await Users.find({}).limit(limit).skip(skip);
//     return request;
//     } catch (error) {
//       console.log('there is an error', error)
//     }
// }

// async function count() {
//     try {
//         let criteria = {}
//         const usersCount = await Users.countDocuments(criteria);
//         return usersCount;
//     } catch (error) {
//         console.log(error)
//     }
    
// }

module.exports = {
    createUsers,
    // getUsersByLimit,
    // count
}