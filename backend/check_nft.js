const express = require('express')
const axios = require('./axios')


const router = express.Router()

const base_api = [
    'https://wax.pink.gg',
    'https://wax.cryptolions.io',
    'https://api.wax.liquidstudios.io',
    'https://wax.eosn.io',
]

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

router.get('/:account', async (req, res) => {
    let account = req.params.account
    account = account.match(/^[a-z0-9.]{4,5}(?:.wam)/gm)
    if(!account || typeof account == "undefined" || account == '') return res.status(400).send({msg: "Invalid Account."})
    account = account[0]
    let index = getRandom(0, base_api.length)
    const url = `${base_api[index]}/v1/chain/get_table_rows`
    console.log(url+` ${account}`)
    const mockIp = `${getRandom(1,255)}.${getRandom(1,255)}.${getRandom(1,255)}.${getRandom(1,255)}`

    await axios.post(url,
    {json: true, code: "m.federation", scope: "m.federation", table: 'claims', lower_bound: account, upper_bound: account},
    {
        headers: {
            'X-Forwarded-For': mockIp
        },
        timeout: 15000
    })
    .then((resp) => {
        if(resp.data) {
            //console.log(resp)
            return res.status(200).send(resp.data)
        }
    })
    .catch((err) => {
        return res.status(500).send(JSON.stringify(err))
    })
})

module.exports = router;
