# NOTE: 

##  List of possible routes to cut/change
- Cuisines
- PriceRange
- restaurant could be just call location

## auto reset databse for test

# Cuisines
## GET - "/cuisines"
    Gets all cuisines

## GET - "/cuisines/:cuisines"
    Get cuisines by id

## POST - "/cuisines"
    Add cuisine

## PUT - "/cuisines/:id"
    Update cuisine by id

## DELETE - "/cuisines/:id"
    Delete cuisine by id

# Groups
## Data Stored
```
{
    groupID:  String,
    groupName: String,
    groupMarks: [ markID: ObjectId ],
    groupMembers: [ userID: ObjectId ]
}
```
## GET - "/groups"
    Gets all groups

## GET - /groups/:groupId
    Get group by id

## POST - "/groups"
    Add group

## PUT - "/groups/:id"
    Update group by id

## DELETE - "/groups/:id"
    Delete group by id

# Marks
## Data Stored
```
{
    markID:  String,
    userID: String,
    groupID: [ groupID: ObjectId],
    locationID: { locationID: ObjectId },
    markCooordinates: [ longtitude: Number, latitude: Number ]
}
```
## GET - "/marks"
    Gets all marks

## GET - "/marks/:groupId"
    Get mark by id

## POST - "/marks"
    Add mark

## PUT - "/marks/:id"
    Update mark by id

## DELETE - "/marks/:id"
    Delete mark by id

# PriceRange
## Data Stored
```
{
    priceID:  String,
    priceRange: Number,
    priceLocations: [ locationID: ObjectId]
}
```
## GET - "/priceRanges"
    Get all price ranges

## GET - "/priceRanges/:priceRange"
    Get price range by id

## POST - "/priceRanges"
    Add price range

## PUT - "/priceRanges/:id"
    Update price range by id

## DELETE - "/priceRanges/:id"
    Delete price range by id

# Restaurants
```
{
    locationID:  String,
    locationName: String,
    locationAddress: { 
 			streetNumber: Number,
			streetName: String,
			city: String,
			province: String,
			zipcode: String }
    userGroups: [ groupID: ObjectId],
    userPicture	: String,
    userPosts: [ postID: ObjectId],
    userReviews: [ reviewID: String ],
    userMarks: [ markID: ObjectId]
}
```
## GET - "/restaurants"
    Get all restaurants

## GET - "/restaurants/:id"
    Get restaurant by id

## POST - "/restaurants"
    Add restaurant

## PUT - "/restaurants/:id"
    Update restaurant by id

## DELETE - "/restaurants/:id"
    Delete restaurant by id

# Reviews
## Data Stored
```
{
    reviewID:  String,
    locationID: { locationId: ObjectId },
    userID: { userId: String } ,
    reviewDescription: String,
    reviewRating: Number
}
```
## GET - "/reviews"
    Get all reviews

## GET - "/reviews"
    Get review by id

## POST - "/reviews"
    Add review

## PUT - "/reviews/:id"
    Update review by id

## DELETE - "/reviews/:id"
    Delete review by id
    
# Users
## Important Note:
    We will need to add authenication to the site I am interested in using json web tokens what do you guys think.   
    https://jwt.io/

## Data Stored
```
{
    userID:  String,
    userPassword: String,
    userFirstName: String,
    userLastName: String,
    userGroups: [ groupID: ObjectId ],
    userPicture	: String,
    userPosts: [ postID: ObjectId ],
    userReviews: [ reviewID: ObjectId ],
    userMarks: [ markID: ObjectId ]
}
```
## GET - "/users"
    Get all users

## GET - "/users/:id"
    Get user account information by id

## POST - "/users"
    Add user

## POST - "/signup"
    Allows user to create account

## POST - "/login"
    Allows user to login to account

## "/ForgetPassword"
    Allows user to reset a forgotten password
    
## "/logout"
    Allows user to logout

## PUT - "/users/:id"
    Update user by id

## DELETE - "/users/:id"
    Delete user by id


# Event
## Data Stored
```
{
    eventID:  String,
    locationID: {locationId: ObjectId },
    groupID: { groupID: ObjectId },
    eventName: String,
    eventDescription: String,
    attendees: [ userID: ObjectId ]
}
```
## GET - "/events"
    Get all events

## GET - "/events"
    Get event by id

## POST - "/events"
    Add event

## PUT - "/events/:id"
    Update event by id

## DELETE - "/events/:id"
    Delete event by id

# Chat
## 