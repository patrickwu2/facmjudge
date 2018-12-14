import express from 'express';
import HomeworkResult from '/model/homeworkResult';
import Homework from '/model/homework';
import User from '/model/user';
import wrap from 'express-async-wrap';
import {requireLogin, checkProblem, checkHomework} from '/utils';
import * as probStat from '/statistic/problem';
import * as hwStat from '/statistic/homework';
import * as LB from '/statistic/leaderboard';
import _ from 'lodash';
import logger from '/logger';

const router = express.Router();

router.get('/problem/:id', requireLogin, checkProblem(), wrap(async (req, res) => {
    if(isNaN(req.problem._id))return res.status(400).send(`id must be a number`);
    if( (!req.user || !( req.user.isAdmin()||req.user.isTA()) ) && !req.problem.showStatistic)return res.status(403).send(`you should not see this`);
    const result = await Promise.all([
        probStat.getProblemResultStats(req.problem._id),
        probStat.getProblemResultBucket(req.problem._id),
        probStat.getProblemPointsDistribution(req.problem._id),
        probStat.getProblemFastest(req.problem._id),
        probStat.getProblemAdminFastest(req.problem._id),
    ]);
    const stats = _.zipObject(['probStats', 'resultBuckets', 
        'pointsDistribution', 'fastest', 'adminFastest'], result);
    const problem = req.problem;
    if( !problem.resource ){
        problem.resource = [];
    }
    if( (req.user.isAdmin()||req.user.isTA()) && !problem.resource.includes('solution') ){
        problem.resource.push('solution');
    }
    res.send({
        stats,
        problem,
    });
}));

router.get('/homework/:id', requireLogin, checkHomework(), wrap(async (req, res) => {
    if(isNaN(req.homework._id))return res.status(400).send(`id must be a number`);
    if( (!req.user || !(req.user.isAdmin()||req.user.isTA()) ) && !req.homework.showStatistic)return res.status(403).send(`you should not see this`);
    const stats = await LB.getLeaderBoard(req.user.isAdmin() || req.user.isTA());
    
    // const result = await Promise.all([
    //     hwStat.getHomeworkResultStats(req.homework._id),
    //     hwStat.getHomeworkPointsDistribution(req.homework._id),
    // ]);
    // const stats = _.zipObject(['hwStats', 'pointsDistribution'], result);
    const hw = req.homework;
    res.send({
        // stats,
        stats,
        hw,
    });
}));

export default router;
