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
    postBook: {
        couldNotPostBook: "Sorry, Book could not be posted. Please Try Again.",
        bookPosted: "Your book has been posted successfully.",
        FileNotSupported: "Invalid file format, Please upload valid files."
    },
};
