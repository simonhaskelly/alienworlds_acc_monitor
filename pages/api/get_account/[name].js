// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from '../AxiosAPI'
import delay from 'delay'

export default async (req, res) => {
    console.log("/get_account called")
    const {
        query: { name },
    } = req
    //console.log(name)
    if(!name || typeof name == "undefined" || name == '') return res.status(400)
    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
    const mockIp = `${getRandom(1,255)}.${getRandom(1,255)}.${getRandom(1,255)}.${getRandom(1,255)}`
    await delay(getRandom(100,2000))
    await axios.get(`https://wax.blokcrafters.io/v2/state/get_account?account=${name}`, {
        timeout: 15000
    })
    .then((resp) => {
        if(resp.status == 200) {
            return res.status(resp.status).json(resp.data)
        }
    })
    .catch(async (err) => {
        console.log("[1] "+ err.message)
        if(err.response && err.response.status === 500 && err.response.data.message.includes("not found")) return
        return axios.get(`https://wax.cryptolions.io/v2/state/get_account?account=${name}`, {
            timeout: 15000
        })
        .then((resp) => {
            if(resp.status == 200) {
                return res.status(resp.status).json(resp.data)
            }
        }).catch(async () => {
            console.log("Bypass started!")
            return axios.get(`https://wax.blokcrafters.io/v2/state/get_account?account=${name}`, {
                headers: {
                    'X-Forwarded-For': mockIp
                },
                timeout: 15000
            })
            .then((resp) => {
                if(resp.status == 200) {
                    console.log("Bypass successful!")
                    return res.status(resp.status).json(resp.data)
                }
            }).catch((err2) => {
                console.log("Get Account Error")
                console.log(err2.message)
            })
        })
    })
}
