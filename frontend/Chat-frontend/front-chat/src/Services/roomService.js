import { httpClient } from "../config/AxiosHelper"

export const createRoomApi = async (roomDetail) =>{
    const responce = await httpClient.post(`api/v1/rooms`,roomDetail,{
        headers: {
            "Content-Type":"text/plain",
        },
    }
    )
    return responce.data;
}


export const joinRoomApi = async(roomId) =>{
    const responce = await httpClient.get(`api/v1/rooms/${roomId}`)
    return responce.data;
}

export const getMessagesApi = async(roomId, size=50, page=0) =>{
    const responce = await httpClient.get(`api/v1/rooms/${roomId}/messages`)
    return responce.data;
}