import mongoose from 'mongoose';
import _ from 'lodash';
import Problem from '/model/problem';
import Homework from '/model/homework';
import logger from '/logger';
const Schema = mongoose.Schema;

const userSchema = Schema({
    email: {
        type: String,
        index: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
	},
	solve : Number,
	time : Number,
	ssh_key: String,
	git_upload_key: String,
    meta: {
        name: String,
        id: String,
    },
	submission_limit: [{
		problem_id:Number,
		last_submission:[Date],
		submission_result:[String],
		AC: String,
		FAC: {	// first AC
			type: Number,
			default: 0,
		},
		quota:Number,
	}],
	roles: [String],
	homeworks: [{
		homework_id: Number,
		file_name: String,
		file_size: String,
		file_sha1: String,
	}],
});

userSchema.methods.hasRole = function(role) {
    const roles = this.roles;
    if (!roles) return false;
    return _.includes(roles, role);
};

userSchema.methods.isAdmin = function() {
    return this.hasRole('admin');
};

userSchema.methods.isTA = function() {
    return this.hasRole('TA');
};

//const default_quota = 5;

userSchema.methods.checkQuota = async function(pid, result, today){
	
	const problem=await Problem.findOne({_id:pid});
	const hw=await Homework.findOne({_id:0});	// get hw0 (hardcoded)
	if(!problem)return false;
	var prob_id = pid._id;
	if (prob_id == 0)	return true;	// do not consider problem 0
	const limit=this.submission_limit;
	let filter_res = limit.filter(function(item, index, array){
		return item.problem_id == prob_id;
	});
	let res ;
	var diff = Math.abs(today - hw.begin);
	var diffMins = Math.round(((diff % 86400000) % 3600000) / 60000);	// get mins
	
	res = filter_res[0]; // get problem
	if (res.last_submission.indexOf(today) > -1){	// rejudge case
		var sub_num = res.last_submission.indexOf(today);
		res.submission_result[sub_num] = result;
	}
	else{											// new submission		
		res.last_submission.push(today);
		res.submission_result.push(result);		
	}

	if (res.submission_result.indexOf("AC") > -1){		// status = AC ?
		res.AC = "AC";
	}
	else{
		res.AC = result;
	}
	await this.save();
	// recheck time, solve and FAC
	var solve = 0;
	var time = 0;
	for (var i = 1; i <= this.submission_limit.length; i++){
		var idx = this.submission_limit[i].submission_result.indexOf("AC");	// when first AC
		var diffMins = 0;
		if (idx > -1){	// have solved
			solve += 1;
			var diff = Math.abs(this.submission_limit[i].last_submission - hw.begin);
			diffMins = Math.round(((diff % 86400000) % 3600000) / 60000);
			this.submission_limit[i].quota = idx;
			time = time + diffMins + this.submission_limit[i].quota;
		}
		else{
			this.submission_limit[i].quota = this.submission_limit[i].last_submission.length;
		}
	}
	this.time = time;
	this.solve = solve;
	
	if (result === "AC"){	// check FAC
		await problem.solved(this.email, today.getTime());
		if (problem.record.WHO_AC === this.email){
			this.submission_limit[prob_id].FAC = 1;
		}
	}
	await this.save();

	// if (res.AC !== "AC"){	// update data only when last submission is not AC
	// 	res.last_submission = diffMins;
	// 	res.AC = result;
	// 	if (result != "AC"){	// add quota if not AC
	// 		res.quota += 1;
	// 	}
	// 	else{	// add peanlty time when AC
	// 		this.solve += 1;
	// 		this.time = this.time + diffMins + 20 * res.quota;
	// 		await problem.solved(this.email, diffMins);	// who and when
	// 		if (problem.record.WHO_AC === this.email){	// first AC
	// 			res.FAC = 1;	
	// 		}
	// 	}
	// 	await this.save();
	// }
	// if (filter_res === undefined || filter_res.length == 0){	// write new information if new submission 
	// 	var Q = 1;
	// 	if (result == "AC"){
	// 		Q = 0;
	// 	}
	// 	res={
	// 		problem_id: pid,
	// 		last_submission: today,
	// 		AC : result,
	// 		quota : Q ,
	// 	};
	// 	this.submission_limit.push(res);
	// 	await this.save();
	// }
	// else{	// more than one times
	// 	res = filter_res[0];
	// 	if (res.AC != "AC"){	// if the user not AC, then update value
	// 		res.last_submission = today;
	// 		if (result != "AC"){
	// 			result.quota += 1;
	// 		}
	// 		res.AC = result;
	// 		await this.save();		
	// 	}		
	// }

};
const User = mongoose.model('User', userSchema);
export default User;

