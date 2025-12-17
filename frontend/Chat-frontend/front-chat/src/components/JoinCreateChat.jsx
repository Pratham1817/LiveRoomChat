import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { createRoomApi, joinRoomApi } from '../Services/roomService';
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import chatbox from "../assets/chat-box.png"


const JoinCreateChat = () => {

  const [detail, setDetail] = useState({
    roomId: "",
    userName:"",
  });

   const{roomId, currentUser,  connected, setRoomId, setCurrentUser, setConnected}= useChatContext()
   const navigate = useNavigate()

  function handleInputChange(event){
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
      
    });
  }

  function validateForm() {
    if (detail.roomId == "" || detail.userName == "") {
      toast.error("Invalid Input !!")
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (validateForm()) {
      console.log(detail);

      try {
       
        const room = await joinRoomApi(detail.roomId)
        toast.success("Joined..")
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);

        navigate("/chat")

      } catch (error) {
        if (error.status == 400) {
          toast.error(error.response.data)
        }else{
          toast.error("Error in joining room")
        }
      }
    }
  }

  async function createRoom() {
    if (validateForm()) {
      console.log(detail);

      try {
      const responce = await createRoomApi(detail.roomId)
      console.log(responce);
      toast.success("Room Created Successfully!!");

      setCurrentUser(detail.userName);
      setRoomId(responce.roomId);
      setConnected(true);

      navigate("/chat")

      } catch (error) {
        console.log(error)
        if (error.response && error.response.status === 400) {
          toast.error("Room ID Already Exists!!")
        }else {
          toast("Error In Creating Room!!")
        }
      }
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-black">
        <div className="p-8 w-full flex flex-col gap-5 max-w-md rounded-xl bg-slate-900 border border-slate-700 shadow-2xl">
           <div>
             <img src={chatbox} className="w-20 mx-auto" />
          </div>
            <h1 className="text-2xl font-bold text-center text-white">Join Room / Create Room</h1>

            <div>
                <label htmlFor="name" className="block font-medium mb-2 text-slate-300">Your name</label>
                <input 
                       onChange={handleInputChange}
                       type="text"
                       id="name"
                       name="userName"
                       value={detail.userName}
                       placeholder="Enter the name"
                       className="w-full bg-slate-800 text-white px-4 py-3 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                    />
            </div>

            <div>
                <label htmlFor="name" className="block font-medium mb-2 text-slate-300">Room ID / New Room ID</label>
                <input 
                       onChange={handleInputChange}
                       type="text" 
                       id="name"
                       name="roomId"
                       value={detail.roomId}
                       placeholder="Enter the room id"
                       className="w-full bg-slate-800 text-white px-4 py-3 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"/> 
            </div>

            <div className="flex justify-center gap-3 mt-4">
                <button onClick={joinChat} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">Join Room</button>
                <button onClick={createRoom} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg">Create Room</button>
            </div>
        </div>
      
    </div>
  )
}

export default JoinCreateChat