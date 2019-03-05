[![Codacy Badge](https://api.codacy.com/project/badge/Grade/33272cbdec92454bb3a4335e533cabfe)](https://www.codacy.com/app/3V0L/spice-rack-api?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=3V0L/spice-rack-api&amp;utm_campaign=Badge_Grade) [![Build Status](https://travis-ci.com/3V0L/spice-rack-api.svg?branch=develop)](https://travis-ci.com/3V0L/spice-rack-api) [![Maintainability](https://api.codeclimate.com/v1/badges/912876bfa551fa40d49a/maintainability)](https://codeclimate.com/github/3V0L/spice-rack-api/maintainability) <a href='https://coveralls.io/github/3V0L/spice-rack-api?branch=develop'><img src='https://coveralls.io/repos/github/3V0L/spice-rack-api/badge.svg?branch=develop' alt='Coverage Status' /></a>

## [LIVE LINK TO API](https://api-spice-rack.herokuapp.com)

# Spice Rack API
An simple API for managing recipes that one enters as well as finding recipes created by other people.

Made using NodeJS, Express, MongoDB, Mongoose and makes use of AirBnB Linting

## Installation
- Navigate to the folder you want to save the project
- Clone the repo
```
$ git clone https://github.com/3V0L/spice-rack-api.git
```
- Enter the working directory
```
$ cd spice-rack-api
```
- Install Dependancies
```
$ npm install
```
- Run tests
```
$ npm test
```
- Run Development Server
```
$ npm run dev
```
- Check if code conforms to ESLint
```
$ npm run lint
```
- Fix Linting Errors
```
$ npm run lint-fix
```


## API EndPoints
| Request        | Endpoint           | Description  |
| ------------- |:-------------:| -----:|
| POST | `/profile/signup` | Register a User |
| POST | `/profile/login` |   Login a User |
| POST | `/profile/userImage` |   Upload a Profile Image for a User |
| GET | `/profile/users` |   Get A List Of All Users |
| GET | `/profile/user/:searchText` |   Search Users for a specific Username |
| GET | `/profile/follow-count/:userId` |   Get All the Followers of a certain User |
| GET | `/profile/single-user/:userId` |   Get the Profile of a single User |
| PATCH | `/profile/follow/:userId` |   Follow a User |
| PATCH | `/profile/unfollow/:userId` |   Unfollow a User |
| GET | `/recipes` |   Get All Recipes |
| GET | `/recipes/:recipeId` |   Get single Recipe |
| GET | `/recipes/user/:userId` |   Get all a Users Recipes |
| GET | `/recipes/search/:field/:searchValue` |   Search a specific field for keywords |
| POST | `/recipes` |   Create a new Recipe |
| POST | `/recipes/review/:recipeId` |   Add a review for a Recipe |
| GET | `/my-recipes` |   Get All Personal Recipes |
| GET | `/my-recipes/:recipeId` |   Get A Single Personal Recipe |
| PATCH | `/my-recipes/:recipeId` |   Edit a Personal Recipe |
| DELETE | `/my-recipes/:recipeId` |   Delete a Personal Recipe |
| POST | `/favourites/:recipeId` |   Add a Recipe to Favourites |
| GET | `/favourites` |   Get a List of all my Favourites |
| DELETE | `/favourites/:recipeId` |   Remove a Recipe from my Favourites |


## Sample Data
- Create User
```
{
"name": "User123",
"email": "user1@mail.com",
"password": "Test123"
}
```
- Login
```
{
"email": "user@mail.com",
"password": "Test123"
}
```
- Create Recipe (Should be sent as form data with an Image)
```
{
"title": "First",
"ingredients": "Teeskjsasa",
"time": 6,
"instructions": {
  "1": "Boil water",
  "2": "cook meal"
},
"servings": 6,
"public": true,
"recipeImage": {Should be an uploaded image in the form}
}
```
- User Image (Should be sent as form data with an Image)
```
"userImage": {Should be an uploaded image in the form}
```
- Review a Recipe
```
{
"rating": 4,
"comment": "This is good"
}
```
- Edit Recipe (Similar to Add recipe, just send only the fields changed in form data)
