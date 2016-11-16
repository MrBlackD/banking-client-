
import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';

 
import injectTapEventPlugin from 'react-tap-event-plugin';


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const containerStyle={
	textAlign:'center',
};
const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

const paperStyle = {


  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
  padding:20,
};

class Client extends React.Component{
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


class Clients extends React.Component{
	constructor(){
		super();
		this.state={
			clients:{},
			search:""
		}
			this.handleDelete=this.handleDelete.bind(this);
			this.handleSearch=this.handleSearch.bind(this);
	}

	componentDidMount(){
		fetch('http://localhost:8080/clients?accesstoken='+this.props.accesstoken)
		.then((response)=>{
		  return response.json()
		}).then((json)=>{
		  if(json.response!="null"){
			this.setState({clients:json});
			console.log(this.state.clients);
		  }
		});
	}

	handleDelete(id){
		console.log(id);
		if(this.props.role!="ADMIN")
			return;

		fetch('http://localhost:8080/client/'+id+'/del?accesstoken='+this.props.accesstoken,{method:"POST"}).
		then((response)=>{
		  console.log(response);
			fetch('http://localhost:8080/clients?accesstoken='+this.props.accesstoken)
			.then((response)=>{
			  return response.json()
			}).then((json)=>{
			  if(json.response!="null"){
				this.setState({clients:json});
				console.log(this.state.clients);
			  }
			});
		});

	}

	handleSearch(e){
		this.setState({search:e.target.value});
	}

	render(){
		if(!this.state.clients.clients)
			return(<CircularProgress size={80} thickness={5} />);
		return(
			<div>
				<TextField floatingLabelText="SEARCH" type="text" value={this.state.search} hintText="SEARCH" name ="search" onChange={this.handleSearch}/>
				<Divider/>
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
			     <TableBody>
				{this.state.clients.clients.map((client)=>{
					let date=new Date(client.regDate);
					date=""+date.getDate()+"."+date.getMonth()+"."+date.getFullYear();
					for(let k in client){
							if(client[k].toString().indexOf(this.state.search)!=-1&&k!="regDate"&&k!="password")
								return(<Client key={client.id} onClick={(id)=>this.handleDelete(id)} client={client} role={this.props.role} accesstoken={this.props.accesstoken} />);
						}
					if(this.state.search==""||date.toString().indexOf(this.state.search)!=-1)
					return(<Client key={client.id} onClick={(id)=>this.handleDelete(id)} client={client} role={this.props.role} accesstoken={this.props.accesstoken} />);
				})}


			</TableBody>
  		</Table>
  		</div>
  );
	}
}

class Document extends React.Component{
	render(){
		let date=new Date(this.props.document.date);
		date=""+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+" "+date.getDate()+"."+date.getMonth()+"."+date.getFullYear();
		let del=<FlatButton label="Cancel" onClick={()=>this.props.onClick(this.props.document.id)}/>;
		if(this.props.role!="ADMIN")
			del="";
		return(
			<TableRow>
				<TableRowColumn>{this.props.document.id}</TableRowColumn>
				<TableRowColumn>{this.props.document.clientId}</TableRowColumn>
				<TableRowColumn>{this.props.document.fromAcc}</TableRowColumn>
				<TableRowColumn>{this.props.document.toAcc}</TableRowColumn>
				<TableRowColumn>{this.props.document.amount}</TableRowColumn>
				<TableRowColumn>{date}</TableRowColumn>
				<TableRowColumn>{del}</TableRowColumn>
			</TableRow>

		);
	}
}

class Documents extends React.Component{
constructor(){
	super();
	this.state={
		documents:{},
		newDocument:{
			fromAcc:"",
			toAcc:"",
			amount:"",
		},
		search:"",
		action:"show",
		open:false
	}

	this.createNewDocument=this.createNewDocument.bind(this);

	this.handleSubmit=this.handleSubmit.bind(this);
	this.handleSearch=this.handleSearch.bind(this);
	this.handleDelete=this.handleDelete.bind(this);


}

	componentDidMount(){
		let query='http://localhost:8080/client/documents?accesstoken=';
		if(this.props.role=="ADMIN")
			query='http://localhost:8080/documents?accesstoken=';
		fetch(query+this.props.accesstoken)
		.then((response)=>{
		  return response.json()
		}).then((json)=>{
		  if(json.response!="null"){
			this.setState({documents:json,display:"documents"});

		  }
		});
	}
	createNewDocument(){
		this.setState({action:"create"});
	}
	handleSubmit(e){
		e.preventDefault();
		fetch('http://localhost:8080/client/documents/new?accesstoken='+this.props.accesstoken,{method:"POST",
	  		body: new FormData(document.forms.create)

	  	}).then((response)=>{
		  console.log(response);
		let query='http://localhost:8080/client/documents?accesstoken=';
		if(this.props.role=="ADMIN")
			query='http://localhost:8080/documents?accesstoken=';
		fetch(query+this.props.accesstoken)
			.then((response)=>{
			  return response.json()
			}).then((json)=>{
			  if(json.response!="null"){
				this.setState({documents:json,display:"documents"});

			  }
			});
		});

		this.setState({action:"show"});
	}

	handleSearch(e){
		this.setState({search:e.target.value});
	}

	handleDelete(id){
		fetch('http://localhost:8080/documents/'+id+'/del?accesstoken='+this.props.accesstoken,{method:"POST"})
		.then((response)=>{
		  console.log(response);
		  let query='http://localhost:8080/client/documents?accesstoken=';
		if(this.props.role=="ADMIN")
			query='http://localhost:8080/documents?accesstoken=';
		fetch(query+this.props.accesstoken)
			.then((response)=>{
			  return response.json()
			}).then((json)=>{
			  if(json.response!="null"){
				this.setState({documents:json,display:"documents"});

			  }
			});
		});
	}

	render(){
		let newDocument=<FlatButton label="NEW DOCUMENT" onClick={this.createNewDocument}/>;
		if(this.props.role=="ADMIN")
			newDocument="";
			
		if(this.state.action=="show"&&this.state.documents.documents)
			return(
			<div>
				{newDocument}
				<TextField floatingLabelText="SEARCH" type="text" value={this.state.search} hintText="SEARCH" name ="search" onChange={this.handleSearch}/>
				<Divider/>
				<Table>
			    <TableHeader displaySelectAll={false}>
			      <TableRow >
			        <TableHeaderColumn>DOCUMENT ID</TableHeaderColumn>
			        <TableHeaderColumn>CLIENT ID</TableHeaderColumn>
			        <TableHeaderColumn>FROM ACCOUNT ID</TableHeaderColumn>
			        <TableHeaderColumn>TO ACCOUNT ID</TableHeaderColumn>
			        <TableHeaderColumn>AMOUNT</TableHeaderColumn>
			        <TableHeaderColumn>DATE</TableHeaderColumn>
			        <TableHeaderColumn>ACTIONS</TableHeaderColumn>
			      </TableRow>
			    </TableHeader>
			     <TableBody>
				{this.state.documents.documents.map((document)=>{
					let date=new Date(document.date);
						date=""+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+" "+date.getDate()+"."+date.getMonth()+"."+date.getFullYear();
						for(let k in document){
							if(document[k].toString().indexOf(this.state.search)!=-1&&k!="date")
								return(<Document role={this.props.role} accesstoken={this.props.accesstoken} onClick={(id)=>this.handleDelete(id)} key={document.id} document={document} />);
						}
					if(this.state.search==""||date.toString().indexOf(this.state.search)!=-1){
						return(<Document role={this.props.role} accesstoken={this.props.accesstoken} onClick={(id)=>this.handleDelete(id)} key={document.id} document={document} />);
					}
				})}
				</TableBody>
				</Table>
			</div>
			);

		if(this.state.action=="create")
			return(
					<form name="create" onSubmit={this.handleSubmit}>
						<TextField hintText="FROM ACCOUNT ID" name="fromacc" type="text"/>
						<TextField hintText="TO ACCOUNT ID" name="toacc" type="text" />
						<TextField hintText="AMOUNT" name="ammount" type="text"/>
						<FlatButton label="SUBMIT" type="submit"/>
					</form>
				);
		return(<CircularProgress size={80} thickness={5} />);
	}
}

class Account extends React.Component{
  constructor(){
	super();
	this.state={
		action:"show",
		account:{},
		open:false
	}
	this.handleUpdate=this.handleUpdate.bind(this);
	this.onClickUpdate=this.onClickUpdate.bind(this);
	this.handleChangeBalance=this.handleChangeBalance.bind(this);
	this.handleChangeClientId=this.handleChangeClientId.bind(this);

  }

  componentDidMount(){
  	this.setState({account:this.props.account})
  }
	handleUpdate(e){
		e.preventDefault();
		console.log("updating...");
		fetch("http://localhost:8080/accounts/"+this.state.account.account_id+"/update?accesstoken="+this.props.accesstoken,{method:"POST",
			body:new FormData(document.forms.account)
		})
		.then((response)=>{
			console.log(response);
			this.setState({action:"show"});
		});

	}

	onClickUpdate(){
		this.setState({action:"update"});
	}

	handleChangeClientId(e){
		let account=this.state.account;
		account.client_id=e.target.value;
		this.setState({account:account});
	}

	handleChangeBalance(e){
		let account=this.state.account;
		account.balance=e.target.value;
		this.setState({account:account});
	}


  render(){
  	if(this.state.action=="update"){

  		return(
		  <TableRow>
			<form name="account" onSubmit={this.handleUpdate}>
			<TableRowColumn>{this.state.account.account_id}</TableRowColumn>
			<TableRowColumn><TextField floatingLabelText="CLIENT ID" hintText="CLIENT ID" type="text" value={this.state.account.client_id} onChange={this.handleChangeClientId} name="client_id"/></TableRowColumn>
			<TableRowColumn><TextField floatingLabelText="BALANCE" hintText="BALANCE" type="text" value={this.state.account.balance} onChange={this.handleChangeBalance} name="balance"/></TableRowColumn>
			<TableRowColumn><FlatButton label="SUBMIT" type="submit"/></TableRowColumn>
			</form>

		  </TableRow>
  			);
  	}
  	let update=<FlatButton label="UPDATE" onClick={this.onClickUpdate}/>;
  	if(this.props.role!="ADMIN")
  		update="";
  	if(this.state.action=="show")
	return(
		<TableRow>
			<TableRowColumn>{this.state.account.account_id}</TableRowColumn>
			<TableRowColumn>{this.state.account.client_id}</TableRowColumn>
			<TableRowColumn>{this.state.account.balance}</TableRowColumn>
			<TableRowColumn>{update}<FlatButton label="DELETE" onClick={()=>this.props.onClick()}/></TableRowColumn>
		</TableRow>
	  );
  }
}

class Accounts extends React.Component{
  constructor(){
	super();
	this.state={
		accounts:{},
		search:"",
		clientId:"",
		open:false
	}
	this.createNewAccount=this.createNewAccount.bind(this);
	this.deleteAccount=this.deleteAccount.bind(this);
	this.handleSearch=this.handleSearch.bind(this);
	this.onChangeClientId=this.onChangeClientId.bind(this);
		this.handleClose=this.handleClose.bind(this);
	this.handleOpen=this.handleOpen.bind(this);
  }

  componentDidMount(){
  	let query='http://localhost:8080/client/accounts?accesstoken=';
  	if(this.props.role=="ADMIN")
  		query='http://localhost:8080/accounts?accesstoken=';
  	fetch(query+this.props.accesstoken)
	.then((response)=>{
	  return response.json()
	}).then((json)=>{
	  if(json.response!="null"){
		this.setState({accounts:json});

	  }
	});
  }

  createNewAccount(){
  	this.handleClose();
  	let query='http://localhost:8080/client/accounts/new?accesstoken=';
  	if(this.props.role=="ADMIN"){
  		query='http://localhost:8080/client/'+this.state.clientId+'/accounts/new?accesstoken=';
  	}
	fetch(query+this.props.accesstoken,{method:"POST"})
		.then((response)=>{
		  console.log(response);
		    let query='http://localhost:8080/client/accounts?accesstoken=';
		  	if(this.props.role=="ADMIN")
		  		query='http://localhost:8080/accounts?accesstoken=';
		  	fetch(query+this.props.accesstoken)
				.then((response)=>{
				  return response.json()
				}).then((json)=>{
				  if(json.response!="null"){
					this.setState({accounts:json});

				  }
				});
		});
	this.setState({clientId:""});
  }

  deleteAccount(account_id){
  	console.log("deleting account "+account_id);
  	let client="";
  	if(this.props.role!="ADMIN")
  		client="client/";
  	fetch('http://localhost:8080/'+client+'accounts/'+account_id+'/del?accesstoken='+this.props.accesstoken,{method:"POST"})
		.then((response)=>{
		  console.log(response);
		    let query='http://localhost:8080/client/accounts?accesstoken=';
		  	if(this.props.role=="ADMIN")
		  		query='http://localhost:8080/accounts?accesstoken=';
		  fetch(query+this.props.accesstoken)
			.then((response)=>{
			  return response.json()
			}).then((json)=>{
			  if(json.response!="null"){
				this.setState({accounts:json});

			  }
			});

		});

  }

  handleSearch(e){
		this.setState({search:e.target.value});
	}

	onChangeClientId(e){
		this.setState({clientId:e.target.value});
	}

	  handleOpen(){
	    this.setState({open: true});
	  };

	  handleClose(){
	    this.setState({open: false});
	  };

  render(){
  	console.log(this.state.accounts);
  	let clientId=<TextField floatingLabelText="CLIENT ID" type="text" hintText="CLIENT ID" onChange={this.onChangeClientId} value={this.state.clientId}/>
  	let update="";
  	let newAcc=<FlatButton label="NEW ACCOUNT" onClick={this.handleOpen}></FlatButton>;
  	if(this.props.role!="ADMIN"){
  		clientId="";
  		newAcc=<FlatButton label="NEW ACCOUNT" onClick={this.createNewAccount}></FlatButton>
  	}

  	const actions = [
      <FlatButton
        label="Cancel"
        onTouchTap={this.handleClose}/>,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={this.createNewAccount}/>,
    ];
    
  	if(this.state.accounts.accounts)
	return(
	   <div>
	   		{newAcc}
	   				<Dialog
		          title="CREATING NEW ACCOUNT"
		          actions={actions}
		          modal={true}
		          open={this.state.open}
		          onRequestClose={this.handleClose}
		        >
		          {clientId}
		        </Dialog>
	   <TextField type="text" floatingLabelText="SEARCH" value={this.state.search} hintText="SEARCH" name ="search" onChange={this.handleSearch}/>
				<Divider/>
				<Table>
			    <TableHeader displaySelectAll={false}>
			      <TableRow >
			        <TableHeaderColumn>ACCOUNT ID</TableHeaderColumn>
			        <TableHeaderColumn>CLIENT ID</TableHeaderColumn>
			        <TableHeaderColumn>BALANCE</TableHeaderColumn>
			        <TableHeaderColumn>ACTIONS</TableHeaderColumn>
			      </TableRow>
			    </TableHeader>
			     <TableBody>
	   {this.state.accounts.accounts.map((account)=>{
		   	for(let k in account){
				if(account[k].toString().indexOf(this.state.search)!=-1)
					return(<Account role={this.props.role} key={account.account_id} accesstoken={this.props.accesstoken} account={account} onClick={()=>this.deleteAccount(account.account_id)}/>)
			}
			if(this.state.search=="")
		   		return(<Account role={this.props.role} key={account.account_id} accesstoken={this.props.accesstoken} account={account} onClick={()=>this.deleteAccount(account.account_id)}/>)
		   })
		}
		</TableBody>
		</Table>
	  </div>);
return(<CircularProgress size={80} thickness={5} />);
  }
}

class Menu extends React.Component{
  constructor(){
	super();
	this.state={
	  display:"client",
	  primary:{
	  	client:true,
	  	accounts:false,
	  	documents:false
	  }

	}
	this.onClickClient=this.onClickClient.bind(this);
	this.onClickAccounts=this.onClickAccounts.bind(this);
	this.onClickDocuments=this.onClickDocuments.bind(this);

  }

  onClickClient(){
  	this.setState({display:"client",primary:{client:true,accounts:false,documents:false}});

  }

  onClickAccounts(){
  	this.setState({display:"accounts",primary:{client:false,accounts:true,documents:false}});
  }

  onClickDocuments(){
  	this.setState({display:"documents",primary:{client:false,accounts:false,documents:true}});
  }


  render(){
	let display=<CircularProgress size={80} thickness={5} />;
	if(this.state.display=="client")
		if(this.props.role=="ADMIN")
			display=<Clients role={this.props.role} accesstoken={this.props.accesstoken}/>;
		else
	 		display=<Client role={this.props.role} accesstoken={this.props.accesstoken}/>;
	if(this.state.display=="accounts")
	  display=<Accounts role={this.props.role} accesstoken={this.props.accesstoken}/>;
	if(this.state.display=="documents")
	  display=<Documents role={this.props.role} accesstoken={this.props.accesstoken}/>;
	return(
	  <div>
		<div>
		  <FlatButton primary={this.state.primary.client} label="Client" onClick={this.onClickClient}/>
		  <FlatButton primary={this.state.primary.accounts} label="Accounts" onClick={this.onClickAccounts}/>
		  <FlatButton primary={this.state.primary.documents} label="Documents" onClick={this.onClickDocuments}/>
		  <FlatButton label="Logout" onClick={()=>this.props.onClick()}/>
		</div>
		<Divider />
		<div>{display}</div>
	  </div>
	  );
  }
}

class Login extends React.Component{
  constructor(){
	super();
	this.state={
	  login:"",
	  password:"",
	}
	this.handleLoginChange = this.handleLoginChange.bind(this);
	this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }
  handleLoginChange(e){
	this.setState({login: e.target.value});

  }
  handlePasswordChange(e){

	this.setState({password: e.target.value});
	
  }

  render(){
	return(
	  <form onSubmit={(e)=>{this.props.onSubmit(e,this.state.login,this.state.password)}}>

		<TextField type="text" floatingLabelText="LOGIN" name="login" hintText="LOGIN" value={this.state.login} onChange={this.handleLoginChange}/><br/>

		<TextField type="password" floatingLabelText="PASSWORD" name="password" hintText="PASSWORD" value={this.state.password} onChange={this.handlePasswordChange}/><br/>
		<FlatButton type="submit" label="SUBMIT"/>

	  </form>)
  }
}


class Registration extends React.Component{
	constructor(){
		super();
		this.state={
			status:"",
			open:false,

		}
		this.handleSubmitReg=this.handleSubmitReg.bind(this);
		this.handleRequestClose=this.handleRequestClose.bind(this);
	}
	handleSubmitReg(e){
		e.preventDefault();
		console.log("Registration handled");
		fetch('http://localhost:8080/client/new',{method:"POST",
	  		body: new FormData(document.forms.reg)

	  	}).then((response)=>{
		  console.log(response);
		  if(response.status=="200")
		  	this.setState({status:"Success!",open:true});
		  if(response.status=="500")
		  	this.setState({status:"All fields are required!",open:true});
		});

	}

	handleRequestClose(){
		this.setState({open:false});
	}
	render(){
		return(
			<div>
				<Snackbar message={this.state.status} open={this.state.open} autoHideDuration={4000} onRequestClose={this.handleRequestClose}/>
				<form name="reg" onSubmit={this.handleSubmitReg}>
					<TextField  floatingLabelText="LOGIN" errorText="" hintText="LOGIN" name="login" type="text"/><br/>
					<TextField  floatingLabelText="FIRSTNAME" hintText="FIRSTNAME" name="firstname" type="text"/><br/>
					<TextField floatingLabelText="LASTNAME" hintText="LASTNAME" name="lastname" type="text"/><br/>
					<TextField floatingLabelText="PASSWORD" hintText="PASSWORD" name="password" type="password"/><br/>
					<FlatButton label="Submit"type="submit"/>
				</form>
			</div>
			);
	}
}

class Main extends React.Component{

  constructor(){
	super();
	this.state={
	  page:"login",
	  accesstoken:"",
	  role:"",
	  open:false,
	  response:{},
	  primary:{
	  	login:true,
	  	reg:false
	  },


	}
		this.onClickLogOut=this.onClickLogOut.bind(this);
		this.Registration=this.Registration.bind(this);
		this.Login=this.Login.bind(this);
		this.handleRequestClose=this.handleRequestClose.bind(this);
  }
  componentDidMount(){
	

  }

  handleSubmit(e,login,password){
	e.preventDefault();
	console.log(login+" "+password);

	fetch('http://localhost:8080/login?login='+login+"&password="+password)
	.then((response)=>{
	  return response.json()
	}).then((json)=>{
	  if(json.response!="null"){
		this.setState({accesstoken:json.response,role:json.role,page:"client"});
		console.log(this.state.accesstoken);
		console.log(this.state.role);
	  }else{
	  	this.setState({open:true});
	  }
	});
  }

  onClickLogOut(){
  	this.setState({page:"login",accesstoken:"",primary:{login:true,reg:false}});
  }

	Registration(){
		this.setState({page:"reg",primary:{login:false,reg:true}});
	}
	Login(){
		this.setState({page:"login",primary:{login:true,reg:false}});
	}

	handleRequestClose(){
		this.setState({open:false});
	}

  render(){
	let display;
	let menu="";
	if(this.state.page!="login"&&this.state.page!="reg")
	  menu=<Menu onClick={()=>this.onClickLogOut()} role={this.state.role} accesstoken={this.state.accesstoken}/>;
	else
		menu=<div><FlatButton primary={this.state.primary.login} label="Login" onClick={()=>this.Login()}/><FlatButton primary={this.state.primary.reg} label="Registration" onClick={()=>this.Registration()}/><Divider/></div>;
	if(this.state.page=="login")
	  display=<Login onSubmit={(e,login,password)=>this.handleSubmit(e,login,password)}/>;
	if(this.state.page=="reg")
		display=<Registration accesstoken={this.state.accesstoken} />;


	return (
		<MuiThemeProvider style={containerStyle}>
			<Paper style={paperStyle} zDepth={1} rounded={false} >
			<Snackbar
          open={this.state.open}
          message="Wrong login/password"
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}/>

				<div>{menu}</div>
				<div>{display}</div>
			</Paper>
		</MuiThemeProvider>

	  );
  }
}


// ========================================

ReactDOM.render(
  <Main />,
  document.getElementById('container')
);
