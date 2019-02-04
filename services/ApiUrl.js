getApiUrl = (host) => {
    let apiurl;
    if (host.includes('dev.my.nemlevering.dk')) {
        apiurl = 'https://dev.api.nemlevering.dk';
    } else if (host.includes('my.nemlevering.dk')) {
        apiurl = 'https://api.nemlevering.dk';
    } else if (host.includes('localhost')) {
        apiurl = 'http://localhost:3333';
    } else {
        apiurl = 'http://10.0.53.90:8000';
    }

    return apiurl;
}

module.exports = {
    getApiUrl: getApiUrl
};