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
        tokenDidNotMatch: "Token sent did not match.",
        authenticationFailed: "Could not authenticate user.",
        invalidToken: "The token provided is invalid.",
        accessNotGranted: "Access not granted to perform the operation.",
        validation: (field: string) => `${field} is required.`,
        invalidEmail: "Provided Email is Invalid.",
    },

    category: {
        couldNotAddCategory: "Sorry, Category could not be added. Please Try Again.",
        categoryAdded: "A New Category had been added.",
        categoryNameAlreadyExists: "Category with the same name already exists. Please use a different name.",
        slugAlreadyExists: "Slug is already taken. Please use a different Slug.",
        validation: (field: string) => `${field} is required.`,
        invalidCategoryName: "Invalid Category Name. Please use a name with only alphabets & space.",
        invalidSlug: "Provided Slug is invalid. Please use a slug with only lower-alphabets & hyphen(-).",
        viewAllCategories: "Showing all Categories.",
        emptyCategory: "No Categories available at the moment. Please contact Admin for new Categories.",
        viewCategoriesError: "Sorry, could not view categories at the moment. Please Try Again.",
    },
};
