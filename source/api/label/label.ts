export default {
    auth: {
        couldNotRegisterUser:
            "Sorry, User could not be registered. Please Try Again.",
        userRegistered: "Your Account has been registered.",
        userAlreadyExists:
            "User with the same email already Exists. Please use a different email.",
        loginSuccessful: "Successfully logged in to the account.",
        loginError: "Could not login into the account. Please Try Again.",
        emailPasswordError:
            "Either Email or password is incorrect. Please Try Again.",

        noTokenFound: "Cannot Sign a token.",
        noUserFound: "User Is not Found.",
        notAdmin: "Not an Admin",
        error: "Something went wrong, Please try Again",
        tokenDidNotMatch: "Token sent did not match.",
        authenticationFailed: "Could not authenticate user.",
        invalidToken: "The token provided is invalid.",
        accessNotGranted: "Access not granted to perform the operation.",
        validation: (field: string) => `${field} is required.`,
        invalidEmail: "Provided Email is Invalid.",
        viewProfileError: "Could not view profile, Please Try Again.",
        viewProfileSuccess: "User profile has been displayed",
        couldNotViewUsers:
            "Sorry, Users could not view at the moment. Please Try Again.",
        userViewed: "All the users has been displayed",
        noUser: "No users has been available at the moment. Please contact Admin for new Users.",
        suspensionMessage: "Please provide a suspension message.",
        userSuspensionError:
            "Sorry, User has not been suspended. Please Try Again",
        userSuspendedSuccess: "User has been suspended.",
        alreadySuspendedUser: "This user has already suspended.",
        profileUpdated: "Your profile has been updated successfully.",
        profileNotUpdated:
            "Your profile has not been updated. Please Try Again.",
        maybeSuspended: "Sorry, the user is ether not found or is suspended.",
        passwordChangeError: "Sorry, Your password couldn't be updated.",
        passwordChanged: "Your password has been updated.",
        hashPasswordError: "Couldn't hash the password.",
        passwordDontMatch:
            "Sorry, the password you provided doesn't match with the old password.",
        oldAndNewAreSame:
            "Sorry, The old password and new password can't be same.",
    },

    postBook: {
        bookFetch: "Books Were Fetched.",
        bookFetchError:
            "Sorry, The books could not be Fetched. Please Try Again.",
        bookUpdated: "Your book was updated",
        bookUpdateError: "Sorry, Your book couldn't be updated.",
        bookDeleted: "Your book was deleted",
        bookDeleteError: "Sorry, Your book couldn't be deleted.",
        bookVerified: "The Book is verified.",
        bookVerificationError:
            "Sorry, The book couldn't be verified. Please Try Again",
        bookRejected: "The Book is Rejected.",
        bookRejectionError:
            "Sorry, The book couldn't be rejected. Please Try Again",
        rejectionMessage: "Please provide a rejection message.",
        notAuthorized: "Sorry, You are not authorized to perform this action.",
        couldNotPostBook: "Sorry, Book could not be posted. Please Try Again.",
        bookPosted: "Your book has been posted successfully.",
        validation: (field: string) => `${field} is required.`,
        requireNumber: "Please enter the number value only.",
        priceIsZero: "Price cannot be 0.",
        stockIsZero: "Stock cannot be 0.",
        chooseCategory: "Please the category of your book.",
        bookNotFound: "Sorry, the book is not found.",
        viewBookMessage: "Showing available books.",
        noBook: "There is no book available in at the moment.",
        couldNotViewBooks:
            "Sorry, could not fetch books at the moment. Please Try Again.",
        stockNotAvailable:
            "Sorry, The book for required amount is out of stock.",
    },

    category: {
        couldNotAddCategory:
            "Sorry, Category could not be added. Please Try Again.",
        categoryAdded: "A New Category had been added.",
        categoryNameAlreadyExists:
            "Category with the same name already exists. Please use a different name.",
        slugAlreadyExists:
            "Slug is already taken. Please use a different Slug.",
        validation: (field: string) => `${field} is required.`,
        invalidCategoryName:
            "Invalid Category Name. Please use a name with only alphabets & space.",
        invalidSlug:
            "Provided Slug is invalid. Please use a slug with only lower-alphabets & hyphen(-).",
        viewAllCategories: "Showing all Categories.",
        emptyCategory:
            "No Categories available at the moment. Please contact Admin for new Categories.",
        couldNotViewCategories:
            "Sorry, could not view categories at the moment. Please Try Again.",
        categoryUpdated: "A Category has been updated.",
        couldNotUpdateCategory:
            "Sorry, Category could not be updated. Please Try Again.",
        categoryNotFound: "Category does not exist to update.",
        categoryDeleted: "A Category has been deleted.",
        couldNotDeleteCategory:
            "Sorry, Category could not be deleted. Please Try Again.",
    },

    cart: {
        couldNotAddBooksToCart:
            "Sorry, The book has not been added to cart. Please Try Again.",
        booksAddedToCart: "This book has been added to cart.",
        noBookFound: (field: string) => `${field} is not found.`,
        couldNotViewCartBooks:
            "Sorry, Books cart cannot view. Please Try Again",
        viewCartBooks: "Books in the cart were displayed",
        emptyCart: "Your cart is empty",
        removeCartBookSuccess: "Book in the cart was removed.",
        removeCartBookError: "Sorry, Book was not removed.",
        cartNotFound: "Cart not found",
        bookNotFound: "Book Not Found",
    },

    order: {
        validation: (field: string) => `${field} is required.`,
        invalidPhoneNumber: "Please provide a phone number",
        selectPaymentGateway: "Please select the payment method for your book",
        orderSuccess: "Your order has been done.",
        orderError: "Your order has not been done, Please Try Again",
        orderViewed: "All the order has been displayed.",
        orderNotViewed:
            "Order has not been displayed at the moment, Please Try Again.",
        emptyOrder: "Empty order list",
        noOrder: "No any order has been placed.",
        stockNotAvailable: (productName: string) =>
            `Stock for ${productName} is not currently available so please decrease quantity or remove the product to checkout.`,
    },

    request: {
        requestAdded: "Your request has been added.",
        requestError: "Your request has not been added. Please Try Again.",
        noBookFound: "Book Not Found.",
        notAuthorize: "Not authorize to exchange a book.",
        validation: (field: string) => `${field} is required.`,
        requestViewed: "All the request has been displayed.",
        requestNotViewed: "Requests has not been displayed.",
        noRequest: "No any request has been found.",
        getRequestStatus: "Status of the request was retrieved.",
        errorGettingRequestStatus: "Status of the request does not retrieved.",
        requestAccepted: "Request for a book has been accepted.",
        requestNotAccepted: "Error in accepting a request for a book.",
        requestRejected: "Request for a book has been rejected.",
        requestNotRejected: "Error in rejecting a request for a book.",
        notAvailable: "Sorry, the book is not available for exchange.",
        getNotifications: "All the notifications was shown.",
        emptyNotifications: "Empty notification found.",
        didNotGetNotification: "Error in getting notifications.",
        requestUpdated: "Request has been updated.",
        errorInEditingRequest: "Request was not updated.",
        notAuthorized: "Sorry, You are not authorized to perform this action.",
        cannotEditRequest:
            "Sorry, request cannot be updated because your request has already been accepted or rejected.",
    },

    review: {
        reviewSuccess: "Review and rating for the book was added.",
        reviewError: "Error in adding review and rating for the book.",
        validation: (field: string) => `${field} is required.`,
        numberRequired: "Please provide a number value.",
        reviewsFetch: "All the reviews of the book was displayed.",
        reviewsFetchError: "Error in getting the reviews of the book.",
        noReviews: "No any reviews has been made for this book.",
        reviewUpdated: "Review of the book was updated.",
        errorInReviewUpdate: "Review of the book was not updated.",
        reviewDeleted: "Review of the book has been deleted.",
        reviewNotFound: "Review not found.",
        errorInReviewDelete: "Review of the book was not deleted.",
        notAuthorized: "Sorry, You are not authorized to perform this action.",
    },
};
