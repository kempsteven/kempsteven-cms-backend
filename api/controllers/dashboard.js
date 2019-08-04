const cloudscraper = require('cloudscraper')

exports.get_dashboard_data = async (req, res, next) => {
    const paramsSince = req.query.since
    const validValues = ['1', '7', '30', '180', '360']

    if (validValues.indexOf(`${paramsSince}`) === -1) {
        return res.status(200).json({
            status: 401,
            message: 'Invalid Params Value!'
        })
    }

    // 1 day = -1440 | 7 days = -10080 | 30 days = -43200
    // 180 day = -259200 | 360 days = -518400
    
    const since = paramsSince * -1440

    const options = {
        uri: `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/analytics/dashboard?continuous=false&since=${since}`,
        headers: {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_KEY}`
        },
    };

    cloudscraper(options)
        .then(response => {
            res.status(200).json(
                JSON.parse(response)
            )
        })
        .catch(err => {
            res.status(200).json({
                message: err
            })
        })
}