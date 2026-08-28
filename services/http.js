// Minimal HTTP helpers built on the runtime's global fetch (Node 18+).
// Replaces the deprecated `request` package.

function buildUrl(url, query) {
    const target = new URL(url);
    for (const [key, value] of Object.entries(query || {})) {
        if (value !== undefined && value !== null) {
            target.searchParams.set(key, value);
        }
    }
    return target;
}

function get(url, query, label) {
    fetch(buildUrl(url, query))
        .then(function(response) {
            console.log(label + " Get response: " + response.status);
        })
        .catch(function(err) {
            console.error(err);
        });
}

function postJson(url, query, json, label) {
    fetch(buildUrl(url, query), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
    })
        .then(function(response) {
            console.log(label + " Post response: " + response.status);
            return response.text();
        })
        .then(function(body) {
            console.log(body);
        })
        .catch(function(err) {
            console.error(err);
        });
}

module.exports = { get, postJson };
