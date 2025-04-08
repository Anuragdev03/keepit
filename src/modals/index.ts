import {createRealmContext} from '@realm/react';
import PasswordRecord from './password';
import SecureNotes from './secureNotes';
import Notes from './notes';
import Authenticator from './autheticator';

export const DBContext = createRealmContext({
    schema: [ PasswordRecord, SecureNotes, Notes, Authenticator ]
})