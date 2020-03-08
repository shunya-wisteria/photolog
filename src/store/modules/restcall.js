import axios    from 'axios'

export const restcall = {
    namespaced : true,

    actions:{
        //----------------------------------------
        //  GET API call
        //----------------------------------------
        async RestGet({commit}, args)
        {
            let retObj = {}

            try{
                let response = await axios.get(
                args.url,
                {
                    headers:args.header
                })
                if(response.status == 200){
                retObj["status"]  = response.status
                retObj["data"]    = response.data
                return retObj
                }
                else
                {
                retObj["status"]  = response.status
                return retObj
                }
            }
            catch(error)
            {
                retObj["status"]  = "404"
                return retObj
            }
        },
    }
}