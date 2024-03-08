import axios from 'axios'
const Image = ()=> {

    const api = "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";

    const imageclassify = async() => {
        try{

            const res = await axios.post("https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
            {
                "inputs":  'filname',
            },{
                headers:{
                    Authorization:`Bearer ${api}`
                }
            })
        }
        catch(e){
            console.log(e)
        }
    }

    return (

        <>
            <div>
                <input placeholder=''/>
            </div>
        </>
    )
}

export default Image