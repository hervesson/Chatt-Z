import React, { useState } from 'react';

const MessageReply = (props) => {
	const [images] = useState(props.reply.imageMessage);
	
	return (
		<div>
		{
			<div className="bg-primary mb-1 rounded">
		    	<div className="d-flex justify-content-start align-items-center">
			    	<div className="pl-1 pr-1">
			    		<p style={{fontSize:10}}> {props.reply.userType == "sender" ? "Voce" : "Cliente"} <br/> 
			    			{
			    				props.reply.message && 
								<span style={{fontSize:15}}>{props.reply.message}</span>
			    			}
			    			{
								props.reply.isAudioMessage && 
								<span style={{fontSize:15}}>Mensagem de Voz</span>
							}
							{
								props.reply.isFileMessage && 
								<span className="fs-6">Arquivo</span>
							}
			    		</p> 
					</div>	
					{
						props.reply.isImageMessage && 
						images.map((imgMsg, key) =>
							<img src={imgMsg.image} alt="chat" key={key} style={{height:50, width:50, paddingLeft:10}}/>
						)	
					}
				</div>
			</div> 
		}
      </div>                                                                                                                              
	)
}

export default MessageReply