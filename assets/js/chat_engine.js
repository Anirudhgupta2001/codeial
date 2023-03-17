class ChatEngine{
    constructor(chatBoxId,userEmail){
        this.chatbox = $(`#${chatBoxId}`) ;
        this.userEmail = userEmail;

        this.socket = io.connect('http://15.207.115.222:5001');

        if(this.userEmail){
            this.connectionhandler();
        }
    }

    connectionhandler(){
        let self=this;
        this.socket.on('connect',function(){
            console.log('connection established using sockets ...');
            self.socket.emit('join_room',{
                user_email: self.userEmail,
                chatroom: 'codieal'
            });

            self.socket.on('user_joined',function(data){
                console.log('A user joined the chat room',data); 
            })
        });

        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();
            if(msg!=''){
                self.socket.emit('send message',{
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codieal'
                });
            }
        });

        self.socket.on('receive-message',function(data){
            console.log('message received',data);

            let newMessage = $('<li>');
            let messageType = 'other-message';

            if(data.user_email==self.userEmail){
                messageType = 'self-message';
            }

            newMessage.append($('<span>',{
                'html': data.message
            }))

            newMessage.append($('<sub>',{
                'html': data.user_email
            }));
            newMessage.addClass(messageType);

            $('#chat-message-list').append(newMessage);
        })
    }
}