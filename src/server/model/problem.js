import mongoose from 'mongoose';
import autoIncrement from './autoIncrement';

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
            default: "Admin",
        },
        WHEN_AC: {
            type: Number,
            default: 1643644800000,
        }
    }
});

problemSchema.methods.solved = async function(who, when){
    if (this.record.WHO_AC === "Admin"){
        this.record.WHO_AC = who;
        this.record.WHEN_AC = when;
    }
    else if (when < this.record.WHEN_AC){
        this.record.WHEN_AC = when;
        this.record.WHO_AC = who;
    }
    await this.save();
};

problemSchema.plugin(autoIncrement.plugin, 'Problem');
const Problem = mongoose.model('Problem', problemSchema);
export default Problem;

