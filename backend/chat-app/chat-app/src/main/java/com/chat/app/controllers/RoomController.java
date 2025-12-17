package com.chat.app.controllers;

import com.chat.app.entities.Message;
import com.chat.app.entities.Room;
import com.chat.app.repositories.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin("http://localhost:5173")
public class RoomController {

    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    //CREATE ROOM
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String roomId){
        //check if room is already exists
        if(roomRepository.findByRoomId(roomId)!=null){
            return ResponseEntity.badRequest().body("Room already exists!!!");
        }

        //else create a new room
        Room room = new Room();
        room.setRoomId(roomId);
        Room savedRoom = roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
    }

    //GET ROOM
    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId){
        Room room = roomRepository.findByRoomId(roomId);
        //check if room is exists
        if(room == null){
            return ResponseEntity.badRequest().body("Room not found!!!");
        }
        //exists then return room
        return ResponseEntity.ok(room);
    }

    //GET MSGS OF ROOM
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessages(
            @PathVariable String roomId,
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "20", required = false) int size)
    {
        Room room = roomRepository.findByRoomId(roomId);
        if(room == null){
            return ResponseEntity.badRequest().build();
        }

        List<Message> messages = room.getMessages();

        int start = Math.max(0, messages.size()-(page+1)*size);
        int end = Math.min(messages.size(), start+size);

        List<Message> paginatedMessages = messages.subList(start, end);

        return ResponseEntity.ok(paginatedMessages);

    }
}

