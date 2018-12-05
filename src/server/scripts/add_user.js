import './common';
import User from '/model/user';
import bcrypt from 'bcrypt';
import {promisify} from 'bluebird';

(async () => {
const hashed = await bcrypt.hash('#####', 10);
const roles = ['student'];
const user = new User({
    email: "#####",
    password: hashed,
    roles: roles,
    meta: {
        id:0,
        name: "#####"
    },
});
await user.save();
})();

