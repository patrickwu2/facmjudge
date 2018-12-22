import mongoose from 'mongoose';
import autoIncrement from './autoIncrement';
import User from '/model/user';

const Schema = mongoose.Schema;

const problemSchema = Schema({
    name: {
        type: String,
        required: true,
        default: 'A Brand New Problem',
    },
    num: {
        type: String,
        required: true,
        default: 'X',
    },
    visible: {
        type: Boolean,
        required: true,
        default: false,
    },
    timeLimit: {
        type: Number,
        default: 1,
    },
    quota: {
        type: Number,
        default: 20,
    },
    hasSpecialJudge: {
        type: Boolean,
        default: false,
    },
    notGitOnly: {
        type: Boolean,
        default: true,
    },
    showStatistic: {
        type: Boolean,
        default: false,
    },
    testdata: {
        count: Number,
        points: Number,
        groups: [{
            count: Number,
            points: Number,
            tests: [String],
        }]
    },
    testFiles: [String],
    resource: [String],
    record: {
        WHO_AC: {
            type: String,
            default: "council-admin",
        },
        WHEN_AC: Date,
    }
});

problemSchema.methods.solved = async function(who, when, pid){
    if (this.record.WHO_AC === "council-admin"){
        this.record.WHO_AC = who;
        this.record.WHEN_AC = when;
    }
    else if (this.record.WHEN_AC - when > 0){   // rejudge case
        this.record.WHEN_AC = when;
        this.record.WHO_AC = who;
    }
    await this.save();
};

problemSchema.methods.checkFAC = async function(who, when, pid){
    if (this.record.WHO_AC == who && this.record.WHEN_AC - when == 0){  // rejudge to not AC
        this.WHO_AC = "council-admin";
    }
    await this.save();
};

problemSchema.plugin(autoIncrement.plugin, 'Problem');
const Problem = mongoose.model('Problem', problemSchema);
export default Problem;

