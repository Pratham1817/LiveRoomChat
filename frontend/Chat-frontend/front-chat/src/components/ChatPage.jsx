import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../config/AxiosHelper";
import toast from "react-hot-toast";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getMessagesApi } from "../Services/roomService";
import { timeAgo } from "../config/helper";



const ChatPage = () => {

  const {roomId, currentUser, connected, setRoomId, setCurrentUser, setConnected} = useChatContext()
  
  const navigate = useNavigate()
  useEffect(()=>{
    if (!connected) {
      navigate("/")
    }
  }, [connected, roomId, currentUser])

  
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);


  useEffect(() =>{
  async function loadMessages() {
    try {
      const messages = await getMessagesApi(roomId);
      setMessages(messages)
    } catch (error) {}
  }
  if (connected) {
    loadMessages();
  }
}, [])


useEffect(() =>{
  if (chatBoxRef.current) {
    chatBoxRef.current.scroll({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    })
  }
}, [messages])



  useEffect(()=>{
    const connectWebSocket = () =>{
      const sock = new SockJS(`${baseURL}/chat`);
      const client = Stomp.over(sock)

      client.connect({},()=>{
        setStompClient(client);
        toast.success("Connected");

        client.subscribe(`/topic/room/${roomId}`, (message)=>{
          console.log(message);

          const newMessage = JSON.parse(message.body);

          setMessages((prev) => [...prev, newMessage]);
        })
      })
    }
    if(connected){
      connectWebSocket();
    }
   
  }, [roomId])
  
  const sendMessage= async() =>{
    if (stompClient && connected && input.trim()) {
      console.log(input);
      
      const message ={
        sender:currentUser,
        content:input,
        roomId:roomId
      }

      stompClient.send(`/app/sendMessage/${roomId}`,{},JSON.stringify(message))
      setInput("")
    }

  }

  const handleLogout=() =>{
    stompClient.disconnect()
    setConnected(false)
    setRoomId("")
    setCurrentUser("")
    navigate("/")
  }

  return (
    <div className="bg-slate-900">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-800 border-b border-slate-700 py-4 shadow-lg flex justify-around items-center">

        <div>
          <h1 className="text-lg font-semibold text-white">Room: <span className="text-blue-400">{roomId}</span></h1>
        </div>

        <div>
          <h1 className="text-lg font-semibold text-white">
            User: <span className="text-emerald-400">{currentUser}</span>
          </h1>
        </div>

        <div>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white font-medium">
            Leave Room
          </button>
        </div>
      </header>

      {/* CHAT AREA */}
      <main
        ref={chatBoxRef}
        className="pt-24 pb-28 pl-10 pr-0 w-3/3 mx-auto h-screen overflow-y-auto bg-slate-900"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex pr-10 ${
              message.sender === currentUser
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`my-2 ${
                message.sender === currentUser
                  ? "bg-blue-600"
                  : "bg-slate-700"
              } p-3 max-w-xs rounded-xl shadow-md`}
             >
              <div className="flex flex-row gap-3">
               
                <img
                  className="h-10 w-10 rounded-full"
                  
                  src="https://avatar.iran.liara.run/public/43"
                  alt=""
                />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-white">{message.sender}</p>
                  <p className="text-white">{message.content}</p>
                  <p className="text-xs text-slate-300">{timeAgo(message.timeStamp)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* INPUT BAR */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-1/2">
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 shadow-xl">
          <input
            value={input}
            onChange={(e) =>{
            setInput(e.target.value)
            }}
            onKeyDown={(e) =>{
              if (e.key === "Enter") {
                sendMessage()
              }
            }}
            type="text"
            placeholder="Type your message here..."
            className="flex-1 bg-slate-700 text-white placeholder-slate-400 px-5 py-2 rounded-lg focus:outline-none focus:border-blue-500 border border-slate-600"
          />

          <button className="bg-slate-600 hover:bg-slate-500 h-11 w-11 flex justify-center items-center rounded-lg">
            <MdAttachFile size={22} className="text-white" />
          </button>

          <button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700 h-11 w-11 flex justify-center items-center rounded-lg">
            <MdSend size={22} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;