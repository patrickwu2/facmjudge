import './common';
import User from '/model/user';
import bcrypt from 'bcrypt';
import {promisify} from 'bluebird';

(async () => {
const hashed = await bcrypt.hash('#####', 10);
const roles = ['admin','student'];
const problem = 11;
var submission_limit = [];	// push 11 problems
for (var i = 0; i < problem; i=i+1){
	res={
		problem_id: i,
		last_submission: null,
		AC : "WA",
		quota : 0,
	};
	submission_limit.push(res);
}
const user = new User({
    email: "#####",
    password: hashed,
    solve: 0,
    time: 0,
    roles: roles,
    submission_limit : submission_limit,
    meta: {
        id:0,
        name: "#####"
    },
});
await user.save();
})();

