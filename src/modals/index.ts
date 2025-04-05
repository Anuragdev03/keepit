import {createRealmContext} from '@realm/react';
import PasswordRecord from './password';

export const DBContext = createRealmContext({
    schema: [ PasswordRecord ]
})