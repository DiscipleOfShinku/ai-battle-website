const express = require('express');
const router = express.Router();

const db = require('../database/knex');

/**
 * Retrieves the leaderboard data for the specified time period and stat.
 */
router.get('/:timePeriod/:stat', function (req, res) {
    var stat = req.params.stat;
    var allowedStats = {
        games_won: 'games_won',
        kills: 'kills',
        graves_taken: 'graves_taken',
        diamonds_earned: 'diamonds_earned',
        health_given: 'health_given'
    };

    var chosenStat = allowedStats[stat];

    if (!chosenStat) {
        res.status(404).send();
        return;
    }

    return db.select('*').from('player_lifetime_stats').orderBy(chosenStat, 'desc').limit(20)
        .then(function (stats) {
            if (stats) {
                res.status(200).send({
                    stats: stats
                });
            } else {
                res.status(404).send();
            }
        }).catch(function (err) {
            res.status(500).send();
            throw err;
        });
});

module.exports = router;