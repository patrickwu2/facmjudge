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
		display_time: Number,
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
	// var diff = Math.abs(today - hw.begin);
	// var diffMins = Math.round(((diff % 86400000) % 3600000) / 60000);	// get mins
	
	res = filter_res[0]; // get problem
	var Diff_idx = -1;
	var REJUDGE = 0;
	for (var j = 0; j < res.last_submission.length; j++){
		if (res.last_submission[j] - today == 0){
			Diff_idx = j;
			break;
		}
	}
	logger.info(`Diff_idx = ${Diff_idx}`);
	if (Diff_idx != -1){	// rejudge case
		res.submission_result[Diff_idx] = result;
		REJUDGE = 1;
	}
	else{											// new submission		
		res.last_submission.push(today);
		res.submission_result.push(result);		
	}

	if (res.submission_result.indexOf("AC") > -1){		// status = AC 
		res.AC = "AC";
	}
	else{												// status != AC
		res.AC = result;
	}
	await this.save();
	// recheck time, solve and FAC
	var solve = 0;
	var time = 0;
	for (var i = 1; i < this.submission_limit.length; i++){
		// logger.info(`>> Pid = ${i}`);
		// logger.info(`>> submission = ${this.submission_limit[i].last_submission}`);
		var idx = this.submission_limit[i].submission_result.indexOf("AC");	// when first AC
		var diffMins = 0;
		var diff = 0;
		if (idx > -1){	// have solved
			solve += 1;
			diff = Math.abs(this.submission_limit[i].last_submission[idx] - hw.begin);
			diffMins = Math.round(diff / 60000);
			this.submission_limit[i].quota = idx;
			this.submission_limit[i].display_time = diffMins;
			time = time + diffMins + this.submission_limit[i].quota * 20;
		}
		else{
			diff = Math.abs(this.submission_limit[i].last_submission[this.submission_limit[i].last_submission.length - 1] - hw.begin);
			diffMins = Math.round(diff / 60000);
			if (!isNaN(diffMins))
				this.submission_limit[i].display_time = diffMins;
			// logger.info(`>> len = ${this.submission_limit[i].last_submission.length}`);
			this.submission_limit[i].quota = this.submission_limit[i].last_submission.length;
		}
	}
	this.time = time;
	this.solve = solve;
	
	if (result === "AC"){	// maybe FAC
		await problem.solved(this.email, today, prob_id);
	}

	if (REJUDGE && result !== "AC"){	// maybe not FAC
		await problem.checkFAC(this.email, today, prob_id);
	}
	if (problem.record.WHO_AC === this.email){
		this.submission_limit[prob_id].FAC = 1;
	}	
	await this.save();

};

const User = mongoose.model('User', userSchema);
export default User;

