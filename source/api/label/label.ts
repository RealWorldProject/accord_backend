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
    },

    postBook: {
        bookFetch: "Books Were Fetched.",
        bookFetchError:
            "Sorry, The books could not be Fetched. Please Try Again.",
        bookVerified: "The Book is verified.",
        bookVerificationError:
            "Sorry, The book couldn't be verified. Please Try Again",
        bookRejected: "The Book is Rejected.",
        bookRejectionError:
            "Sorry, The book couldn't be rejected. Please Try Again",
        rejectionMessage: "Please provide a rejection message.",
        couldNotPostBook: "Sorry, Book could not be posted. Please Try Again.",
        bookPosted: "Your book has been posted successfully.",
        validation: (field: string) => `${field} is required.`,
        requireNumber: "Please enter the number value only.",
        chooseCategory: "Please the category of your book.",

        viewBookMessage: "Showing available books.",
        noBook: "There is no book available in at the moment.",
        couldNotViewBooks:
            "Sorry, could not fetch books at the moment. Please Try Again.",
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
        couldNotAddBooksToCart: "Sorry, The book has not been added to cart. Please Try Again.",
        booksAddedToCart: "This book has been added to cart.",
        noBookFound: (field: string) => `${field} is not found.`,
    }
};
