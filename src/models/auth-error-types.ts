enum AuthErrorType { 
    NO_ERROR, INVALID_EMAIL, INVALID_CREDENTIAL, SERVER_UNAVAILABLE, AWAITING_CONFIRMATION
};

export function getAuthErrorMessage(error: AuthErrorType): string {
    switch (error) {
        case AuthErrorType.AWAITING_CONFIRMATION: return 'Now check your mailbox and follow the link in the email.';
        case AuthErrorType.INVALID_CREDENTIAL: return 'Wrong credentials! Try again.';
        case AuthErrorType.SERVER_UNAVAILABLE: return 'The service is temporarily unavailable.';
        case AuthErrorType.INVALID_EMAIL: return 'Incorrect email address.';
        default: return '';
    }
}

export default AuthErrorType;
