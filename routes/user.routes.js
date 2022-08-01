const router = require("express").Router()

const User = require("../models/User.model")

const { isLoggedIn } = require('../middleware/session-guards')
const { rolesChecker } = require('../utils/checker-roles')


//ALL USERS
router.get('/', isLoggedIn, (req, res, next) => {

    const roles = rolesChecker(req.session.currentUser)

    User
        .find()
        .then(users => res.render('users/users-list', { users, roles }))
        .catch(error => next(new Error(error)))
})


//USER DETAILS
router.get('/:id/details', isLoggedIn, (req, res, next) => {

    const { id } = req.params

    User
        .findById(id)
        .populate('favRecipes')
        .then(user => res.render('users/user-profile', { user }))
        .catch(error => next(new Error(error)))
})


//EDIT USER 
router.get('/:id/edit', isLoggedIn, (req, res, next) => {

    const { id } = req.params

    User
        .findById(id)
        .then(user => res.render('users/user-update', { user }))
        .catch(error => next(new Error(error)))
})

//EDIT USER
router.post('/:id/edit', isLoggedIn, (req, res, next) => {

    const { username, email, password, avatar, description, role } = req.body
    const { id } = req.params

    User
        .findByIdAndUpdate(id, { username, email, password, avatar, description, role })
        .then(() => res.redirect(`/users/${id}/details`))
        .catch(error => next(new Error(error)))
})


//DELETE USER 
router.get('/:id/delete', isLoggedIn, (req, res, next) => {

    const { id } = req.params

    User
        .findByIdAndDelete(id)
        .then(() => res.redirect(`/`))
        .catch(error => next(new Error(error)))
})


// FAVRECIPES ROUTES
router.post('/:recipe_id/favRecipes', isLoggedIn, (req, res, next) => {

    const { _id: user_id } = req.session.currentUser
    const { recipe_id } = req.params

    User
        .findByIdAndUpdate(user_id, { $push: { favRecipes: recipe_id } })
        .then(() => res.redirect(`/recipes/${recipe_id}/details`))
        .catch(error => next(new Error(error)))
})

module.exports = router