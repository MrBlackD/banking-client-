import React from 'react';

let Client=class Client extends React.Component{
	constructor(){
	super();
	this.state={
		client:{},
		action:"show"
	}

	this.onClickUpdate=this.onClickUpdate.bind(this);

	this.handleLoginChange=this.handleLoginChange.bind(this);
	this.handlePasswordChange=this.handlePasswordChange.bind(this);
	this.handleLastNameChange=this.handleLastNameChange.bind(this);
	this.handleFirstNameChange=this.handleFirstNameChange.bind(this);
	this.handleUpdateClient=this.handleUpdateClient.bind(this);
  }

componentDidMount(){
	console.log("prop "+this.props.accesstoken)
	fetch('http://localhost:8080/client?accesstoken='+this.props.accesstoken)
	.then((response)=>{
	  return response.json()
	}).then((json)=>{
	  if(json.response!="null"){
		this.setState({client:json});

	  }
	});
}

	handleLoginChange(e){
		if(e.target.value=="")
			return;
		const newClient=this.state.client;
		newClient.login=e.target.value;
		this.setState({client:newClient});

	}
	handlePasswordChange(e){
		if(e.target.value=="")
			return;
		const newClient=this.state.client;
		newClient.newPassword=e.target.value;
		this.setState({client:newClient});
		console.log(this.state.client);
	}
	handleFirstNameChange(e){
		if(e.target.value=="")
			return;
		const newClient=this.state.client;
		newClient.firstName=e.target.value;
		this.setState({client:newClient});
	}
	handleLastNameChange(e){
		if(e.target.value=="")
			return;
		const newClient=this.state.client;
		newClient.lastName=e.target.value;
		this.setState({client:newClient}); 
	}
	handleUpdateClient(e){
		e.preventDefault();
		console.log("Updating");
		
	  	fetch('http://localhost:8080/client/update?accesstoken='+this.props.accesstoken,{method:"POST",
	  		body: new FormData(document.forms.client)

	  	}).then((response)=>{
		  console.log(response);
		  console.log(document.forms.client);
			console.log(new FormData(document.forms.client));
		});
		this.setState({action:"show"});
	}
	onClickUpdate(){
		this.setState({action:"update"});
	}

  render(){
  	if(!this.state)
  		return(<div></div>);
  	if(this.state.action=="update"){
  		return(
		  <form name='client' onSubmit={this.handleUpdateClient}>
			<ul>
			  <li>LOGIN: <input value={this.state.client.login} onChange={this.handleLoginChange} name="login"/></li>
			  <li>FIRSTNAME: <input value={this.state.client.firstName} onChange={this.handleFirstNameChange} name="firstname"/></li>
			  <li>LASTNAME: <input value={this.state.client.lastName} onChange={this.handleLastNameChange} name="lastname"/></li>
			  <li>PASSWORD: <input name="password" onChange={this.handlePasswordChange}/></li>
			  <li><input type="submit"/></li>
			</ul>
		  </form>
  		)
  	}

	let date=new Date(this.state.client.regDate);
	date=""+date.getDate()+"."+date.getMonth()+"."+date.getFullYear();
	return(

	  <div>
		<ul>
		  <li>ID: {this.state.client.id}</li>
		  <li>LOGIN: {this.state.client.login}</li>
		  <li>FIRSTNAME: {this.state.client.firstName}</li>
		  <li>LASTNAME: {this.state.client.lastName}</li>
		  <li>REGISTRATION DATE: {date}</li>
		  <li><a href="#" onClick={this.onClickUpdate}>Update</a></li>
		</ul>
	  </div>
	  )
  }
}

module.export=Client;