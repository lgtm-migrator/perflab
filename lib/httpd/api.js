"use strict";

let parseUrl = require('parseurl'),
	querystring = require('querystring');

// calls the given function, converting the result into
// JSON, or returning an HTTP error response if there's
// no data
function handler(f) {
	return function(req, res, next) {
		let ok = (data) => data ? res.json(data) : res.error();
		let err = (e) => res.error(e.message);
		let args = [].slice.call(arguments, 3);
		return f.apply(this, args).then(ok, err);
	}
}

// as above, but looks at the 'skip' and 'limit' parameters
// and passes those to the callback (after any bound parameters)
function pageHandler(f) {
	return function(req, res, next) {
		let url = parseUrl(req);
		let query = querystring.parse(url.query);
		let ok = (data) => data ? res.json(data) : res.error();
		let err = (e) => res.error(e.message);
		let args = [].slice.call(arguments, 3);

		let skip = +query.skip || 0;
		let limit = +query.limit || 0;
		if (limit < 0) { limit = 0; }
		args.push(skip, limit);

		return f.apply(this, args).then(ok, err);
	}
}

// as 'handler' above, but takes any JSON that was passed
// in the request body and adds it as a parameter to those
// passed to the callback
function bodyHandler(f) {
	return function(req, res, next) {
		let args = [].slice.call(arguments, 3);
		args.push(req.body);
		let ok = (data) => data ? res.json(data) : res.error();
		let err = (e) => res.error(e.message);
		return f.apply(this, args).then(ok, err);
	}
}

module.exports = (db) => ({
	'/config': {
		'GET /':						handler(db.getConfigs),
		'GET /:id':						handler(db.getConfigById),
		'DELETE /:id':					handler(db.deleteConfigById),
		'PUT /:id':						bodyHandler(db.updateConfig),
		'POST /':						bodyHandler(db.insertConfig),
		'GET /:id/queue/enabled':		handler(db.getQueueEntryEnabled),
		'PUT /:id/queue/enabled/':		bodyHandler(db.setQueueEntryEnabled),
		'GET /:id/queue/repeat':		handler(db.getQueueEntryRepeat),
		'PUT /:id/queue/repeat/':		bodyHandler(db.setQueueEntryRepeat),
		'PUT /:id/queue/priority/':		bodyHandler(db.setQueueEntryPriority),
		'GET /run/:id/':				pageHandler(db.getRunsByConfigId)
	},
	'/run': {
		'GET /:id':						handler(db.getRunById),
		'GET /:id/recalc':				handler(db.updateStatsByRunId),
		'GET /test/:id/':				handler(db.getTestsByRunId),
		'GET /memory/:id/':				handler(db.getMemoryStatsByRunId)
	},
	'/test': {
		'GET /:id':						handler(db.getTestById)
	},
	'/queue': {
	},
	'/control': {
		'GET /':						handler(db.getControl),
		'GET /paused':					handler(db.getPaused),
		'PUT /paused/':					bodyHandler(db.setPaused)
	},
	'/log': {
		'GET /':						handler(db.getLog)
	}
});