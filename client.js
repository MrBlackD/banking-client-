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
	if(this.props.client){
		this.setState({client:this.props.client});
		return;
	}
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
		const newClient=this.state.client;
		newClient.login=e.target.value;
		this.setState({client:newClient});

	}
	handlePasswordChange(e){
		const newClient=this.state.client;
		newClient.newPassword=e.target.value;
		this.setState({client:newClient});
		console.log(this.state.client);
	}
	handleFirstNameChange(e){
		const newClient=this.state.client;
		newClient.firstName=e.target.value;
		this.setState({client:newClient});
	}
	handleLastNameChange(e){
		const newClient=this.state.client;
		newClient.lastName=e.target.value;
		this.setState({client:newClient}); 
	}
	handleUpdateClient(e){
		e.preventDefault();
		console.log("Updating");
		let query='http://localhost:8080/client/update?accesstoken=';
		if(this.props.role=="ADMIN")
			query='http://localhost:8080/client/'+this.state.client.id+'/update?accesstoken=';
	  	fetch(query+this.props.accesstoken,{method:"POST",
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
  			<TableRow>
		  <form name='client' onSubmit={this.handleUpdateClient}>
			  <TableRowColumn><TextField hintText="LOGIN" value={this.state.client.login} onChange={this.handleLoginChange} name="login"/></TableRowColumn>
			  <TableRowColumn><TextField hintText="FIRSTNAME" value={this.state.client.firstName} onChange={this.handleFirstNameChange} name="firstname"/></TableRowColumn>
			  <TableRowColumn><TextField hintText="LASTNAME" value={this.state.client.lastName} onChange={this.handleLastNameChange} name="lastname"/></TableRowColumn>
			  <TableRowColumn><TextField hintText="PASSWORD" name="password" onChange={this.handlePasswordChange}/></TableRowColumn>
			  <TableRowColumn><FlatButton label="SUBMIT" type="submit"/></TableRowColumn>

		  </form>
		  </TableRow>
  		)
  	}

	let date=new Date(this.state.client.regDate);
	date=""+date.getDate()+"."+date.getMonth()+"."+date.getFullYear();
	let del=<FlatButton onClick={()=>this.props.onClick(this.state.client.id)} label="DELETE"/>;
	if(this.props.role!="ADMIN")
		del="";
	if(this.props.role=="ADMIN")
		return(

			<TableRow>
				<TableRowColumn>{this.state.client.id}</TableRowColumn>
				<TableRowColumn>{this.state.client.login}</TableRowColumn>
				<TableRowColumn>{this.state.client.firstName}</TableRowColumn>
				<TableRowColumn>{this.state.client.lastName}</TableRowColumn>
				<TableRowColumn>{date}</TableRowColumn>
				<TableRowColumn><FlatButton onClick={this.onClickUpdate} label="UPDATE"/>{del}</TableRowColumn>
			</TableRow>
		  )
	else
				return(
			<Table>
			    <TableHeader displaySelectAll={false}>
			      <TableRow >
			        <TableHeaderColumn>ID</TableHeaderColumn>
			        <TableHeaderColumn>LOGIN</TableHeaderColumn>
			        <TableHeaderColumn>FIRSTNAME</TableHeaderColumn>
			        <TableHeaderColumn>LASTNAME</TableHeaderColumn>
			        <TableHeaderColumn>REGISTRATION DATE</TableHeaderColumn>
			        <TableHeaderColumn>ACTIONS</TableHeaderColumn>
			      </TableRow>
			    </TableHeader>
			     <TableBody displayRowCheckbox={false}>
			<TableRow >
				<TableRowColumn>{this.state.client.id}</TableRowColumn>
				<TableRowColumn>{this.state.client.login}</TableRowColumn>
				<TableRowColumn>{this.state.client.firstName}</TableRowColumn>
				<TableRowColumn>{this.state.client.lastName}</TableRowColumn>
				<TableRowColumn>{date}</TableRowColumn>
				<TableRowColumn>{del}</TableRowColumn>
			</TableRow>
			</TableBody>
			</Table>
		  )
  }
}

module.export=Client;