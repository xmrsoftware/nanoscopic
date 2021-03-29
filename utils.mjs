'use strict';

function check_if_logged_in(req, res) {
    if (req.session === null) {
        res.status(403).send('You are not authorised to see this URL')
    }
}

export {check_if_logged_in}