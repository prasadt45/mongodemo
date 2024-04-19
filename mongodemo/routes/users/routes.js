const express = require('express');
const router = express.Router();
const User = require('../../dblayer/user');
const { Error } = require('mongoose');
const GenerateResponse = require('../../utils/response_creator');

// HTTP get method to get list of users, this function would get invoked at /users/ API call 
router.get('/', async (req, res) => {
    const users = await getUsers();
    res.json(new GenerateResponse(true, undefined, users));
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json(new GenerateResponse(false, "User not found"));
        }
        res.json(new GenerateResponse(true, undefined, user));
    } catch (error) {
        res.status(500).json(new GenerateResponse(false, error.message));
    }
});

router.put('/:id', async (req, res) => {
    const userObj = req.body;
    User.findByIdAndUpdate(userObj.data._id, { ...userObj })
        .then(async(data) => {
            const users = await getUsers(); // Assuming getUsers() fetches all users
            res.json({ success: true, data: users });
            console.log(data);
        }).catch((err) => {
            console.log(err);
            res.status(404).json({ success: false, message: "User not found" });
        })

});

router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body); // Creating new user with provided fields
        const users = await getUsers();
        res.json(new GenerateResponse(true, undefined, users));
    } catch (error) {
        if (error instanceof Error) {
            res.json(new GenerateResponse(false, error.message));
        } else {
            res.json(new GenerateResponse(false, error));
        }
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const delResult = await User.deleteOne({ _id: req.params.id });
        if (delResult.hasOwnProperty("deletedCount") && delResult.deletedCount === 1) {
            const users = await getUsers();
            res.json(new GenerateResponse(true, undefined, users));
        } else {
            res.json(new GenerateResponse(false, "Unable to delete user at the moment."));
        }
    } catch (error) {
        if (error instanceof Error) {
            res.json(new GenerateResponse(false, error.message));
        } else {
            res.json(new GenerateResponse(false, error));
        }
    }
});

async function getUsers() {
    const users = await User.find({}).lean();
    return users instanceof Array ? users : [];
}

module.exports = router;