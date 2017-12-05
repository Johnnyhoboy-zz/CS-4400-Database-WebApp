import ReactDOM from 'react-dom';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import Dropdown from 'react-dropdown';
import "react-dropdown/style.css";

const server = "http://localhost:8080";
//
// The following variables define the entire screen components
// Any subcomponents meant to be reused should be defined at the specified section below
//

var LogIn = React.createClass({
	getInitialState : function() {
		return { username: '', password: ''};
	},
    render : function() { return (
    	<div className="LogIn">
    		<center>
	    	<h1>Log In</h1>
	    	<form>
			  Username:<br />
			  <input type="text" onChange={this.userChange}/><br />
			  Password:<br />
			  <input type="password" onChange={this.passChange}/><br />
	    	</form>
	        <br />
	    	<button onClick={this.login}>Login</button> <br /> <br/>
	    	<button onClick={this.nRegistration}>Register</button> <br /> <br />
	    	</center>
    	</div>
    	); 
	},
	userChange : function(e) {
		this.setState({ username: e.target.value} );
	},
	passChange : function(e) {
		this.setState({ password: e.target.value} );
	},
	login: function() {
		if (this.state.username == '' || this.state.password == '') {
			alert('Please fill out all non-optional fields');
			return;
		} 
		fetch(server + '/login', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				 "Username": this.state.username,
				 "Password": this.state.password,
			})
		}).then(function(response) {
                return response.json();
            }).then(data => {
 				if (data.message == 'loginError') {
					alert('The login you inputed was incorrect!');
				} else if (data.message == 'admin') {
					showAdminFunctionality();
				} else if (data.message == 'passenger') {
					showPassengerFunctionality(this.state.username);
				}
            });
	},

    nRegistration : function() { showRegistration(); },
    nPassengerFunctionality : function() { showPassengerFunctionality(this.state.username); },
    nAdminFunctionality : function() { showAdminFunctionality(); }
});

var Registration = React.createClass({
	getInitialState : function() {
		return { username: '', email: '', password: '', confirmPassword: '', breezeCardNum: '', type: "new"};
	},
    render : function() { return (
    	<div class="Registration">
    		<center>
	    	<h1>Registration</h1>
	    	<hr />
	    	 <form>
			  <label>Username: </label>
			  <input type="text" onChange={this.userChange}/><br />
			  <label>Email: </label>
			  <input type="text" onChange={this.emailChange}/><br />
			  <label>Password: </label>
			  <input type="password" onChange={this.passChange}/><br />
			  <label>Confirm Password: </label>
			  <input type="password" onChange={this.confirmPassChange} /><br />

			  <h3>Breeze Card</h3>
			  <input type="radio" name="UseBreezeCard" value="old" checked={this.state.type!='new'} onChange={this.typeChange}/><label>Use my existing Breeze Card</label><br />
			  <label>Card Number: </label>
			  <input type="text" onChange={this.cardChange}/><br />
			  <input type="radio" name="UseBreezeCard" value="new" checked={this.state.type=='new'} onChange={this.typeChange}/><label>Get a new Breeze Card</label><br />
	    	</form>
	    	<hr />
	        <br />

	    	<button onClick={this.register}>Create Account</button>
	    	<button onClick={this.nLogin}>Back</button>
	    	</center>

    	</div>
    	);
	},

	userChange : function(e) {
		this.setState({ username: e.target.value} );
	},
	emailChange : function(e) {
		this.setState({ email: e.target.value} );
	},
	passChange : function(e) {
		this.setState({ password: e.target.value} );
	},
	confirmPassChange : function(e) {
		this.setState({ confirmPassword: e.target.value} );
	},
	cardChange : function(e) {
		this.setState({ breezeCardNum: e.target.value} );
	},
	typeChange : function(e) {
		this.setState({ type: e.target.value} );
	},
	register : function() {
		if (this.state.username == '' || this.state.email == '' || this.state.password == '' || this.state.confirmPassword == '') {
			alert('Please fill out all non-optional fields');
			return;
		} else if (this.state.password.length <=7 || this.state.password != this.state.confirmPassword) {
			alert('Please make sure your passwords match and is at least 8 chars');
			return;
		} else if (this.state.email.includes("@") == false || this.state.email.includes(".") == false) {
			alert('Please make sure your email is valid');
			return;
		} else if (this.state.type != "new" && (this.state.breezeCardNum.length <=15 || this.state.breezeCardNum.length > 16)) {
			alert('Please input a valid 16 digit Breeze Card');
			return;
		}
		fetch(server + '/registerAccount', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				 "Username": this.state.username,
				 "Email": this.state.email,
				 "Password": this.state.password,
				 "BreezecardNum": this.state.breezeCardNum,
				 "Type" : this.state.type
			})
		}).then(function(response) {
                return response.json();
            }).then(data => {
 				if (data.message == 'userError') {
					alert('The username you inputed already exists!');
				} else if (data.message == 'emailError') {
					alert('The email you inputed already exists!');
				} else if (data.message == 'sameBreezecard') {
					alert('You entered in an existing Breezecard, suspending it, and generating new Breezecard');
					showPassengerFunctionality(this.state.username);
				} else {
					showPassengerFunctionality(this.state.username);
				}
            });
	},

	nPassengerFunctionality : function() { showPassengerFunctionality(this.state.username); },
	nLogin : function() { showLogIn(); }
	
});

var chosenCard = '';
var chosenStarting= '';
var chosenEnding = '';
var PassengerFunctionality = React.createClass({

	getInitialState : function() {
		return { data: [], cardData: [], endData: [],selectedCard: chosenCard, selectedStart: chosenStarting, selectedEnd: chosenEnding, value: '', fare: '', prompt: 'Start Trip', disable: '', count: '', current: {}, currentE: {} }
	},
	componentDidMount : function() {
		fetch(server + "/stationListData")
		.then(response => response.json())
		.then(data => { this.setState({ data: data });}
		);

		fetch(server + "/stationListData")
		.then(response => response.json())
		.then(data => this.setState({ endData: data })
		);

		fetch(server + '/passengerCards',
        {method: 'post',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
			 "username": this.props.username
         })
        })
		.then(response => response.json())
		.then(data => this.setState({ cardData: data })
		);

		fetch(server + "/inProgress", {method:"post",headers:{'Content-Type':'application/json'},body: JSON.stringify({"breezecard":this.state.selectedCard})})
		.then(response => response.json())
		.then(data => { this.setState({ count: data.count }, function () {
				if(this.state.count > 0) {
					this.setState({ prompt: 'In Progress', disable: 'true'} );
				}
			});}
		);

	},
    render : function() { 
    	var cards = this.state.cardData.map(function(items) {
    		return items.BreezecardNum;
    	});
		return (
    	
    	<div class="PassengerFunctionality">
	    	<p>Welcome To Marta</p>
	    	
	    	<p>Passenger Functionality</p>

	    	<div style={{width: "250px"}}>
	    		<label>Breeze Card </label>
	    		<Dropdown options={cards} onChange={this.selectedCard} value={this.state.selectedCard} />
	    		<a href="#"onClick={this.nManageCards}>Manage Cards</a>
	    	</div>
	    	<br/>
	    	<p>Balance: ${this.state.value}</p>
	    	<br/>
	    	<br/>
	    	<div style={{width: "250px"}}>
	    		<label>Start At </label>
	    		<Dropdown options={this.state.data} onChange={this.selectedStart} value={this.state.current.label} />
	    		<a href="#" onClick={this.startTrip}>{this.state.prompt}</a>
			</div>
			<br/>
			<br/>
			<div style={{width: "250px"}}>
				<label>End At </label>
	    		<Dropdown options={this.state.endData} onChange={this.selectedEnd} value={this.state.currentE.label} />
	    		<a href="#"onClick={this.endTrip}>End Trip</a>
			</div>
			<br/>
			<br/>
	    	<button onClick={this.nTripHistory}>Go To Trip History</button>
	    	<br/>
	    	<button onClick={this.nLogin}>Back</button>
    	</div>
    	);
	},
	selectedCard : function(e) {
		this.setState({ selectedCard: e.value}, function() {
		chosenCard = this.state.selectedCard;
		fetch(server + '/getValue',
        {method: 'post',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
             "BreezecardNum": this.state.selectedCard,
         })
        }).then(response => response.json())
        .then(data => this.setState({value : data.Value}, ()=>this.componentDidMount()));
        });
	},
 
 	selectedStart : function(e) {
		this.setState({ selectedStart: e.value, current: {'value': e.value, 'label': e.label}}, function() {
		chosenStarting = this.state.selectedStart;
		fetch(server + '/getFare',
        {method: 'post',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
             "Start": this.state.current.value,
         })
        }).then(response => response.json())
        .then(data => { console.log(this.state); 
        this.setState({fare : data.EnterFare})});
   
		fetch(server + '/endStationListData',
        {method: 'post',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
             "Start": e.value,
         })
        }).then(response => response.json())
        .then(data => this.setState({endData : data, currentE: {}})
        );
	    });
	},

	selectedEnd : function(e) {
		this.setState({ selectedEnd: e.value, currentE: {'value': e.value, 'label': e.label}}, function() {
			chosenEnding = this.state.selectedEnd;
		});
	},

	startTrip : function() {
		if(this.state.prompt == 'In Progress') {
			return;
		}
		if(this.state.selectedCard == '') {
			alert('Breezecard cannot be null');
			return;
		}
		if(parseInt(this.state.value) < parseInt(this.state.fare)) {
        	alert('Insufficient funds');
        	return;
        }
		fetch(server + '/startTrip', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				 "Start": this.state.current.value,
				 "BreezecardNum": this.state.selectedCard,
			})
		});
		this.setState({ prompt: 'In Progress', disable: 'true'} );
	},
	endTrip : function() {
		if(this.state.selectedStart == '' && this.state.prompt == 'Start Trip') {
			alert('Must start trip before you can end it');
			return;
		}
		fetch(server + '/endTrip', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				 "End": this.state.currentE.value,
				 "BreezecardNum": this.state.selectedCard,
				 "sort": this.state.sort,
             	 "desc": this.state.descending
			})
		});
		this.setState({prompt: 'Start Trip', disable: 'false'} );
	},
	nTripHistory : function() { console.log(this.props.username); showTripHistory(this.props.username); },
	nManageCards : function() { showManageCards(this.props.username); },
	nLogin : function() { showLogIn(); }
});

const manageOptions = ['Breezecard', 'Value'];
var ManageCards = React.createClass({
    getInitialState : function() {
		console.log("props: " + this.props.username);
    	var oColumns = [
			{
                Header: '',
                accessor: 'editButton',
                Cell: (row) => (
                    <div>
						<input type="radio" name="cardNumber" value="select" 
								onClick={() => this.selectRow(row)}/>
					</div>
                ),
                maxWidth: 40
            },
			{ Header: 'Card Number', accessor: 'BreezecardNum' },
			{ Header: 'Value', accessor: 'Value' },
			
		];
        return { columns: oColumns, data: [], selectedRow: null, card: '', value: '', credit: '', selected: manageOptions[0], descending: '', descendingCheck: 'false', sort: 'BreezecardNum' };
    },
    selectRow : function(row) {
		this.setState( {selectedRow: row.original} );
	},
	
    render : function() { 
    	const defaultOption = this.state.selected;
    	return (
    	<div class="ManageCards">
	    	<p>Manage Cards</p>
            <p>Breeze Cards</p>
            <div>
            <text>Order By:</text>
                <Dropdown options={manageOptions} onChange={this.sortChange} value={defaultOption} />
                <text>
                    Sort Descending?
                </text>
                <input type="checkbox" name="descending_checkbox" id="descending_checkbox" onClick={this.descendingChange} checked={this.state.descendingCheck} />
            </div>
            <button onClick={this.update}>Update</button>
            <ReactTable
				    data={this.state.data}
				    columns={this.state.columns}
					sortable={false}
					defaultPageSize={10} 
				  />
		    	<br/>
		    	<button onClick={this.removeCard}>Remove Selected Card</button>
		    	<br/>
                <input type="text" onChange={this.newCard}/>
	    	    <button onClick={this.addCard}>Add Card</button>
	    	    <br/>
	    	    <p>Add Value to Selected Card</p>
	    	    <div><label>Credit Card # </label><input type="text" onChange={this.credit}/></div>
	    	    <br/>
	    	    <div><label>Value </label><input type="text" onChange={this.newVal} /></div>
	    	    <br/>
	    	    <button onClick={this.valueChange}>Add Value</button>
	    	    <br/>
	    	    <div style={{width: "250px"}}>
                </div>
                <br/>
		    	<button onClick={this.nPassengerFunctionality}>Back To Passenger Functionality</button>
	    	</div>
    	);
	},
	componentDidMount : function() {
		this.update();
	},
	removeCard : function () {
		if(this.state.data.length == 1) {
			alert('Each passenger must have at least one Breezecard');
			return;
		} else {
			fetch(server + '/removeCard', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				 "BreezecardNum": this.state.selectedRow.BreezecardNum
			})
		});
		fetch(server + '/passengerCardData',
        {method: 'post',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
			 "username": this.props.username,
             "sort": this.state.sort,
             "desc": this.state.descending
         })
        }).then(function(response) {
            return response.json();
        }).then(data => this.setState({data : data}));
		}
	},
	update : function() {
        fetch(server + '/passengerCardData',
        {method: 'post',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
			 "username": this.props.username,
             "sort": this.state.sort,
             "desc": this.state.descending
         })
        }).then(function(response) {
            return response.json();
        }).then(data => this.setState({data : data}));
    },
	sortChange: function(e) {
        if (e.value == manageOptions[0]) {
            this.setState({sort: "BreezecardNum"});
        } else {
            this.setState({sort: "Value"});
        }
        this.setState({selected: e});

    },
	descendingChange: function(e) {
        if(e.target.checked) {
            this.setState({descending: 'DESC', descendingCheck: true});
        } else {
            this.setState({descending: '', descendingCheck: false});
        }
    },

	newCard : function(e) {
		this.setState({ card: e.target.value} );
	},

	credit : function(e) {
		this.setState({ credit: e.target.value});
	},

	newVal : function(e) {
		this.setState({ value: e.target.value} );
	},

	addCard : function() {
		if(this.state.card == '') {
			alert('Please fill out the card field');
			return;
		}
		if(this.state.card.length != 16) {
			alert('Cards must have 16 digits');
			return;
		}
		fetch(server + '/addCard', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				"username": this.props.username,
				 "BreezecardNum": this.state.card
			})
		}).then((response) => response.json()).then((data)=>{ this.update(); if (data.message) alert(data.message); });
	},
    
    valueChange: function() {
		if(this.state.credit == '' || this.state.credit.length != 16) {
			alert('Must have 16-digit credit card to add value');
			return;
		}
		fetch(server + '/addValue', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				 "Value": this.state.value,
				 "Card": this.state.selectedRow.BreezecardNum
			})
		}).then((response) => this.update());
	},

	nPassengerFunctionality : function() { showPassengerFunctionality(this.props.username); }
});

var TripHistory = React.createClass({
    getInitialState : function() {
		var oColumns = [
			{ Header: 'Time', accessor: 'StartTime' },
            { Header: 'Source', accessor: 'StartsAt' },
            { Header: 'Destination', accessor: 'EndsAt' },
            { Header: 'Fare Paid', accessor: 'Tripfare' },
            { Header: 'Card #', accessor: 'BreezecardNum' },
		];
		return { columns: oColumns, data: [], start: '', end: '', descending: '', descendingCheck: false, sort: 'StartTime'};
	},
	

  	render : function() {
  		return (
	    	<div class="TripHistory">
		    <h1>Trip History</h1>
		    <div><label>Input time in the follow format of YYYY-MM-DD hh-mm-ss </label></div>
	    	<div><label>Start </label><input type="dateTime-local" onChange={this.start} value={this.state.start}/></div>
	    	<br/>
	    	<div><label>End </label><input type="dateTime-local" onChange={this.end} value={this.state.end}/></div>
	    	<br/>
	    	<button onClick={this.updateHist}>Update</button>
	    	<button onClick={this.reset}>Reset</button>
	    	<br/>
	    	<div style={{width: "250px"}}>
	    	<text>
                    Sort Descending?
                </text>
                <input type="checkbox" name="descending_checkbox" id="descending_checkbox" onClick={this.descendingChange} checked={this.state.descendingCheck} />
            </div>
	    	<ReactTable
				data={this.state.data}
				columns={this.state.columns}
				sortable={false}
				defaultPageSize={10} 
			/>	
		    	
	    	<button onClick={this.nPassengerFunctionality}>Back to Passenger Functionality</button>
	    	</div>
    	);
	},
	componentDidMount : function() {
		this.updateHist();
	},
    start : function(e) {
		this.setState({ start: e.target.value} );
	},

	end: function(e) {
		this.setState({ end: e.target.value} );
	},
	descendingChange: function(e) {
        if(e.target.checked) {
            this.setState({descending: 'DESC', descendingCheck: true});
        } else {
            this.setState({descending: '', descendingCheck: false});
        }
    },
	updateHist: function() {
		fetch(server + '/updateHistory',
        {method: 'post',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
			 "username": this.props.username,
             "Start": this.state.start,
             "End": this.state.end,
             "sort": this.state.sort,
             "desc": this.state.descending,
         })
        }).then(response => response.json())
        .then(data => this.setState({data : data}));
    },

    reset: function() {
        this.setState({ start: '', end: ''}, () => this.updateHist());
    },
	nPassengerFunctionality : function() { showPassengerFunctionality(this.props.username); }
});



var AdminFunctionality = React.createClass({
    render : function() { return (
        <div className="AdminFunctionality"> 
		<center>
	    	<p>Admin Functionality</p>
	    	<button onClick={this.nBreezecardManagement}>Go To Breezecard Management</button> <br /> <br />
	    	<button onClick={this.nStationManagement}>Go To Station Management</button> <br /> <br />
	    	<button onClick={this.nPassengerFlowReport}>Go To PassengerFlowReport</button> <br /> <br />
	    	<button onClick={this.nSuspendedCards}>Go To Suspended Cards</button> <br /> <br />
	    	<button onClick={this.nLogin}>Back</button> <br />
		</center>
    	</div>
        );
    },
    nBreezecardManagement : function() { showBreezecardManagement(); },
    nStationManagement : function() { showStationManagement(); },
    nPassengerFlowReport : function() { showPassengerFlowReport(); },
    nSuspendedCards : function() { showSuspendedCards(); },
    nLogin : function() { showLogIn(); }
});

const breezeCardManagementOptions = ['Card #', 'Value', 'Owner'];
var BreezecardManagement = React.createClass({

    getInitialState : function() {

        var oColumns = [
            {
                Header: '',
                accessor: 'editButton',
                Cell: (row) => (
                    <div>
                        <input type="radio" name="stationtype" value="select"
                                onClick={() => this.selectRow(row)}/>
                    </div>
                ),
                maxWidth: 40
            },
            { Header: 'Card #', accessor: 'BreezecardNum' },

            { Header: 'Value ($)', accessor: 'Value' },
            { Header: 'Owner', accessor: 'BelongsTo' }
        ];

        return { columns: oColumns, data: [], owner: '', suspended: false, cardNumber: '',
                 valueLow: '', valueHigh: '', setValue: '', transfer: '', sort: "BreezecardNum",
                 selected: breezeCardManagementOptions[0], descending: '', descendingCheck: false, selectedRow: null};
    },
    selectRow : function(row) {
        this.setState( {selectedRow: row.original} );
    },
    render : function() {
        const style5 = {
            paddingRight: '5px',
            paddingBottom: '5px'
        };
        const style40 = {
            paddingLeft: '40px'
        };

        const defaultOption = this.state.selected;

        return (
        <div class="BreezecardManagement">
            <p>Breeze Card Management</p>
            <h3> Breeze Cards </h3>
            <h5> Search/Filter </h5>
            <p>
                <text style={style5}>
                    Owner:
                </text>
                <span style={style5}>
                    <input type="text" name="owner_textbox" onChange={this.ownerChange} value={this.state.owner}/>
                </span>
                <input type="checkbox" name="suspended_checkbox" id="suspended_checkbox" onClick={this.suspendedChange} checked={this.state.suspended}/>
                <label htmlFor="suspended_checkbox"> Show Suspended Cards </label>
            </p>
            <p>
                <text style={style5}>
                    Card Number:
                 </text>
                <input type="text" name="card_number_textbox" onChange={this.cardNumberChange} value={this.state.cardNumber}/>
                <span style={style40}>
                    <button onClick={this.resetFields}> Reset </button>
                </span>
            </p>
            <span style={style5}>
                <text style={style5}>
                    Value between:
                </text>
                <input type="text" name="value_start_textbox" size='6' onChange={this.valueLowChange} value={this.state.valueLow}/>
            </span>
            <text style={style5}>
                and:
            </text>
            <input type="text" name="value_end_textbox" size='6' onChange={this.valueHighChange} value={this.state.valueHigh}/>
            <span style={style40}>
                    <button onClick={this.updateData}> Update Filter </button>
            </span>
            <p></p>
            <text style={style5}>
                Order by:
            </text>
            <div style={{width: "250px"}}>
                <Dropdown options={breezeCardManagementOptions} onChange={this.sortChange} value={defaultOption} />
                <text style={style5}>
                    Sort Descending?
                </text>
                <input type="checkbox" name="descending_checkbox" id="descending_checkbox" onClick={this.descendingChange} checked={this.state.descendingCheck} />
            </div>
            <p></p>
            <ReactTable
                    data={this.state.data}
                    columns={this.state.columns}
                    defaultPageSize={15}
                    sortable={false}
                    defaultSortMethod={undefined}/>
            <p>
                <span style={style5}>
                    <input type="text" name="card_value_textbox" onChange={this.setValueChange} value={this.state.setValue}/>
                </span>
                <button onClick={this.changeCardValue}>Set Value of Selected Card</button>
            </p>
            <p>
                <span style={style5}>
                    <input type="text" name="transfer_card_textbox" onChange={this.transferChange} value={this.state.transfer}/>
                </span>
                <button onClick={this.transferCard}>Transfer Selected Card</button>
            </p>

            <button onClick={this.nAdminFunctionalitya}>Back</button>
        </div>
        );
    },
    componentDidMount : function() {
        this.updateData();
    },
    ownerChange: function(e) {
        this.setState({owner : e.target.value});
    },
    sortChange: function(e) {
        if (e.value == breezeCardManagementOptions[0]) {
            this.setState({sort: "BreezecardNum"});
        } else if (e.value == breezeCardManagementOptions[1]) {
            this.setState({sort: "Value"});
        } else {
            this.setState({sort: "BelongsTo"});
        }
        this.setState({selected: e});

    },
    suspendedChange: function(e) {
        this.setState({suspended : e.target.checked});
    },
    descendingChange: function(e) {
        if (e.target.checked) {
            this.setState({descending : 'DESC', descendingCheck: true});
        } else {
            this.setState({descending : '', descendingCheck: false});
        }
    },
    cardNumberChange: function(e) {
        this.setState({cardNumber: e.target.value});
    },
    valueLowChange: function(e) {
        this.setState({valueLow: e.target.value});
    },
    valueHighChange: function(e) {
        this.setState({valueHigh: e.target.value});
    },
    setValueChange: function(e) {
        this.setState({setValue: e.target.value});
    },
    transferChange: function(e) {
        this.setState({transfer: e.target.value});
    },
    updateData: function() {
        fetch(server + '/adminBreezeCardData',
        {method: 'post',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
             "owner": this.state.owner,
             "cardNumber": this.state.cardNumber,
             "valueLow": this.state.valueLow,
             "valueHigh": this.state.valueHigh,
             "suspended": this.state.suspended,
             "sort": this.state.sort,
             "desc": this.state.descending
         })
        }).then(function(response) {
            return response.json();
        }).then(data => this.setState({data : data}));
    },
    changeCardValue: function() {
        if (!this.state.selectedRow) {
            alert('You need to select a breezecard to change the value!');
        } else {
            fetch(server + '/adminBreezeCardValueChange',
                {method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "breezecardNumber": this.state.selectedRow.BreezecardNum,
                    "cardValue": this.state.setValue
                })
            }).then(function(response) {
                return response.json();
            }).then(data => {
                if (data.message == 'error') {
                    alert('The field for breezecard value is not a number!');
                }
                this.updateData();
            });
        }
    },
    transferCard: function() {
        fetch(server + '/adminBreezecardTransfer',
            {method: 'post',
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({
                "cardNumber": this.state.selectedRow.BreezecardNum,
                "originalOwner": this.state.selectedRow.BelongsTo,
                "newOwner": this.state.transfer
               })
             }).then(function(response) {
                return response.json();
             }).then(data => {
                if (data.message == 'error') {
                    alert('The entered username is not a passenger!');
                }
                this.updateData();
             });
    },
    resetFields: function() {
        this.setState({owner: '', suspended: false, cardNumber: '', valueLow: '', valueHigh: '',
                       sort: "BreezecardNum", descending: '', descendingCheck: false, selectedRow: null,
                       selected: breezeCardManagementOptions[0], setValue: '', transfer: ''}, () => this.updateData());
    },
    nAdminFunctionalitya : function() { showAdminFunctionality(); }
});


var SuspendedCards = React.createClass({
	getInitialState : function() {
			var oColumns = [
				{
					Header: '',
						accessor: 'editButton',
						Cell: (row) => (
							<div>
								<input type="radio" name="ownertype" value="select"
										onClick={() => this.selectRow(row)}/>
							</div>
						),
						maxWidth: 40
				},
				{ Header: 'Card #', accessor: 'BreezecardNum' },
				{ Header: 'New Owner', accessor: 'Username'},
				{ Header: 'Date Suspended', accessor: 'DateTime' },
				{ Header: 'Previous Owner', accessor: 'BelongsTo'}
			];
			return { columns: oColumns, data: [], selectedRow: null };
		},

		selectRow : function(row) {
			this.setState( {selectedRow: row.original} );
		},

		componentDidMount : function() {
			fetch(server + "/suspendedCardsData")
			.then(response => response.json())
			.then(data => this.setState({ data: data })
			);
		},
		refreshState : function() {
				fetch(server + "/suspendedCardsData")
				.then(response => response.json())
				.then(data => this.setState({ data: data })
				);
		},
	  	render : function() {
	  		return (
		    	<div class="SuspensedCardManagement">
			    	<h1>Suspended Cards</h1>
			    	<ReactTable
					    data={this.state.data}
					    columns={this.state.columns}
					    sortable={false}
					  /><br />
					 <center>
			    	<button onClick={this.changeNewOwner}>Assign Selected Card to New Owner</button><br /><br />
			    	<button onClick={this.changePrevOwner}>Assign Selected Card to Previous Owner</button><br /><br />
			    	<br />
			    	<p> Assigning the card to an owner will unlock all<br />
						accounts conflicted on the same Breeze Card </p> <br />
					<button onClick={this.nAdminFunctionality}>Back To Admin</button>
					</center>
		    	</div>
	    	);
		},
	changeNewOwner : function() {
		if (!this.state.selectedRow) {
			alert('You need to choose a Breezecard before you can assign it.');
		} else {

			var newUser = this.state.selectedRow.Username;
			var oldUser = this.state.selectedRow.BelongsTo;
			var breezeNum = this.state.selectedRow.BreezecardNum;
			fetch(server + '/updateOwner', {
				method: 'post',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					"Username": newUser,
					"otherUser" : oldUser,
					"BreezecardNum": breezeNum
				})
			}).then(function(response) {
				return response.json();
			}).then(data => this.refreshState() );
		}
	},
	changePrevOwner : function() {
		if (!this.state.selectedRow) {
			alert('You need to choose a Breezecard before you can assign it.');
		} else {

			var oldUser = this.state.selectedRow.BelongsTo;
			var newUser = this.state.selectedRow.Username;
			var breezeNum = this.state.selectedRow.BreezecardNum;
			fetch(server + '/updateOwner', {
				method: 'post',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					"Username": oldUser,
					"otherUser" : newUser,
					"BreezecardNum": breezeNum
				})
			}).then(function(response) {
				return response.json();
			}).then(data => this.refreshState() );
		}
	},
	nAdminFunctionality : function() { showAdminFunctionality(); }
});

const passengerFlowOptions = ['Station Name', '# Passengers In', '# Passengers Out', 'Flow', 'Revenue'];
var PassengerFlowReport = React.createClass({
    getInitialState : function() {
        var oColumns = [
            { Header: 'Station Name', accessor: 'stationName' },
            { Header: '# Passengers In', accessor: 'passIn' },
            { Header: '# Passengers Out', accessor: 'passOut' },
            { Header: 'Flow', accessor: 'flow' },
            { Header: 'Revenue', accessor: 'revenue'}
        ];
        return { columns: oColumns, data: [], descending: '', descendingCheck: false, selected: passengerFlowOptions[0], timeStart: '',
                 timeEnd: '', sort: 'stationName', warning_text: ''};
    },
    render : function() {
        const style5 = {
            paddingRight: '5px',
            paddingBottom: '5px'
        };
        const style40 = {
            paddingRight: '40px'
        }

        const defaultOption = this.state.selected;

        return (
        <div class="PassengerFlowReport">
            <p>Passenger Flow Report</p>
            <p>
                <span style={style5}>
                    <text style={style40}>
                        Start Time
                    </text>
                    <input type="datetime-local" name="start_time_textbox" onChange={this.startChange} value={this.state.timeStart}/>
                </span>
                <span style={style5}>
                    <button onClick={this.updatePress}>Update</button>
                </span>
                <button onClick={this.resetData}>Reset</button>
            </p>
            <p>
                <span style={style5}>
                    <text style={style40}>
                        End Time
                    </text>
                    <input type="datetime-local" name="end_time_textbook" onChange={this.endChange} value={this.state.timeEnd}/>
                    <span style={{paddingLeft: "15px"}}>
                        <text id = 'text_warning' style = {{color: 'red'}}>
                            {this.state.warning_text}
                        </text>
                    </span>
                </span>
            </p>
             <div style={{width: "250px"}}>
                <text>Order By:</text>
                <Dropdown options={passengerFlowOptions} onChange={this.sortChange} value={defaultOption} />
                <text style={style5}>
                    Sort Descending?
                </text>
                <input type="checkbox" name="descending_checkbox" id="descending_checkbox" onClick={this.descendingChange} checked={this.state.descendingCheck} />
            </div>
            <p></p>
            <ReactTable
                data={this.state.data}
                columns={this.state.columns}
                defaultPageSize={10}
                sortable={false}/>
            <button onClick={this.nAdminFunctionality}>Back</button>
        </div>
        );
    },
    componentDidMount: function() {
        this.updateData();
    },
    startChange: function(e) {
        this.setState({timeStart: e.target.value});
    },
    endChange: function(e) {
        this.setState({timeEnd: e.target.value});
    },
    descendingChange: function(e) {
        if(e.target.checked) {
            this.setState({descending: 'DESC', descendingCheck: true});
        } else {
            this.setState({descending: '', descendingCheck: false});
        }
    },
    sortChange: function(e) {
        if (e.value == passengerFlowOptions[0]) {
            this.setState({sort: "stationName"});
        } else if (e.value == passengerFlowOptions[1]) {
            this.setState({sort: "passIn"});
        } else if (e.value == passengerFlowOptions[2]) {
            this.setState({sort: "passOut"});
        } else if (e.value == passengerFlowOptions[3]) {
            this.setState({sort: 'flow'});
        } else {
            this.setState({sort: 'revenue'});
        }
        this.setState({selected: e});

    },
    updatePress: function() {
        if (this.state.timeStart == '') {
            if (this.state.timeEnd == '') {
                this.setState({warning_text: "Start and end time are either invalid or blank. Queried with no time restriction." });
            } else {
                this.setState({warning_text: "Start time is either invalid or blank. Queried with no start time restriction." });
            }
        } else if (this.state.timeEnd == '') {
            this.setState({warning_text: "End time is either invalid or blank. Queried with no end time restriction." });
        } else {
            this.setState({warning_text : ''});
        }
        this.updateData();
    },
    updateData : function() {
        fetch(server + '/passengerFlowData',
        {method: 'post',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
             "timeStart": this.state.timeStart,
             "timeEnd": this.state.timeEnd,
             "sort": this.state.sort,
             "desc": this.state.descending
         })
        }).then(function(response) {
            return response.json();
        }).then(data => this.setState({data : data}));
    },
    resetData: function() {
        this.setState({data: [], descending: '', descendingCheck: false, selected: passengerFlowOptions[0], timeStart: '',
                 timeEnd: '', sort: 'stationName', warning_text: ''}, function() {
                        this.updateData();
                 });
    },
    nAdminFunctionality : function() { showAdminFunctionality(); }
});

const stationManagementSortOptions = ['Station Name', 'Stop ID', 'Fare', 'Status'];
var StationManagement = React.createClass({
    getInitialState : function() {
        var oColumns = [
            {
                Header: '',
                accessor: 'editButton',
                Cell: (row) => (
                    <div>
                        <input type="radio" name="stationtype" value="select"
                                onClick={() => this.selectRow(row)}/>
                    </div>
                ),
                maxWidth: 40
            },
            { Header: 'Station Name', accessor: 'Name' },
            { Header: 'Stop ID', accessor: 'StopID' },
            { Header: 'Fare', accessor: 'EnterFare' },
            { Header: 'Status', accessor: 'ClosedStatus'}
        ];
		return { columns: oColumns, data: [], selectedRow: null, descending: '',
			sort: 'Name' };
    },
    selectRow : function(row) {
        this.setState( {selectedRow: row.original} );
    },
    componentDidMount : function() {
		fetch(server + '/stationManagementData', {
		 method: 'post',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
             "sort": this.state.sort,
             "desc": this.state.descending
         })
        }).then(function(response) {
            return response.json();
        }).then(data => this.setState({data : data}));
    },
    render : function() {
        return (
            <div class="StationManagement">
                <h1>Station Listing</h1>
				<div style={{width: "250px"}}>
				<p>Sort by:</p>
				<Dropdown options={stationManagementSortOptions} 
						onChange={this.sortChange} 
						value={this.state.sort}/>
                <text>Sort Descending?</text>
				<input type="checkbox" name="descending_checkbox" id="descending_checkbox" 
						onClick={this.descendingChange} />
				<br /><button onClick={this.updateSort}>Update Sort</button>
            </div>
                <ReactTable
                    data={this.state.data}
                    columns={this.state.columns}
                    sortable={false}
                  />
                <button onClick={this.nViewStation}>View Station</button>
                <button onClick={this.nCreateStation}>Create Station</button>
                <br />
                <button onClick={this.nAdminFunctionality}>Back To Admin Functionality</button>
            </div>
        );
	},
	updateSort : function() {
		this.componentDidMount();
	},
	sortChange: function(e) {
		['Station Name', 'Stop ID', 'Fare', 'Status'];
		if (e.value == 'Station Name')
			this.setState({sort: 'Name'});
		else if (e.value == 'Stop ID')
			this.setState({sort: 'StopID'});
		else if (e.value == 'Fare')
			this.setState({sort: 'EnterFare'});
		else if (e.value == 'Status')
			this.setState({sort: 'ClosedStatus'})
	},
	descendingChange: function(e) {
        if (e.target.checked) {
            this.setState({descending : 'DESC'});
        } else {
            this.setState({descending : ''});
        }
    },
    nViewStation : function() {
        if (!this.state.selectedRow) {
            alert('You need to choose a station before you can view it.');
        } else {
            showViewStation(this.state.selectedRow.StopID);
        }
    },
    nCreateStation : function() { showCreateStation(); },
    nAdminFunctionality : function() { showAdminFunctionality(); }
});

var ViewStation = React.createClass({
    getInitialState : function() {
        return { name: '', id: '', fare: -1, open: 'closed', intersection: '', newFare: '' }
    },
    render : function() { return (
        <div class="ViewStation">
            <h1>{this.state.name} (id {this.state.id})</h1><br />
            <p>Current Fare: ${this.state.fare}</p>
            <label>$</label><input type="text" onChange={this.fareChange}/>
            <button onClick={this.updateFare}>Update Fare</button>
            <p>Nearest Intersection: {this.state.intersection}</p>
            <p>Should the station be open or closed?</p>
            <form>
                <input type="radio" name="open" value="open" checked={this.state.open=='open'}
                        onChange={this.openChange} />
                <label>Open</label><br />
                <input type="radio" name="open" value="closed" checked={this.state.open=='closed'}
                        onChange={this.openChange} />
                <label>Closed</label><br />
            </form>
            <button onClick={this.updateOpen}>Update</button>
            <br /><br /><button onClick={this.nStationManagement}>Back to Station Management</button>
        </div>
        );
    },
    componentDidMount : function() {
        this.refreshState();
    },
    refreshState : function() {
        fetch(server + '/viewStationData', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                 "StopID": this.props.initialId
            })
        }).then(function(res){ return res.json(); })
        .then(data => this.setState(
            {
                    name: data.Name, id: data.StopID, fare: data.EnterFare,
                    open: (data.ClosedStatus) ? "closed" : "open",
                    intersection: (data.intersection != null) ? data.intersection
                        : 'Not available for trains'
            }));
    },
    fareChange : function(e) {
        this.setState({ newFare: e.target.value} );
    },
    openChange : function(e) {
        this.setState({ open: e.target.value });
    },
    updateOpen : function() {
        fetch(server + '/updateOpen', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                 "StopID": this.state.id,
                 "open": this.state.open
            })
        });
    },
    updateFare : function() {
        if (this.state.newFare < 0 || this.state.newFare > 50) {
            alert('Fares must be between $0.00 and $50.00');
        } else {
            fetch(server + '/updateFare', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "StopID": this.state.id,
                    "EnterFare": this.state.newFare
                })
            }).then(function(response) {
                return response.json();
            }).then(data => this.refreshState() );
        }
    },
    nStationManagement : function() { showStationManagement(); }
});

var CreateStation = React.createClass({
    getInitialState : function() {
        return { name: '', id: '', fare: 0.0, type: "train", open: "closed", nearest: '', message: "" };
    },
    render : function() { return (
        <div class="CreateStation">
            <div><label>Station Name   </label><input type="text" onChange={this.nameChange} /></div>
            <div><label>Stop ID   </label><input type="text" onChange={this.idChange} /></div>
            <div><label>Entry Fare   $</label><input type="text" onChange={this.fareChange} /></div><br />
            <p>Station Type</p>
            <form>
                <input type="radio" name="stationtype" value="bus" checked={this.state.type!='train'} onChange={this.typeChange} />
                <label>Bus</label><br />
                <label>Nearest Intersection (Optional)</label>
                <input type="text" onChange={this.nearestChange}/><br />
                <input type="radio" name="stationtype" value="train" checked={this.state.type=='train'} onChange={this.typeChange} />
                <label>Train</label><br />
                <p>Should the station be open or closed?</p>
                <input type="radio" name="open" value="open" checked={this.state.open!='closed'} onChange={this.openChange} />
                <label>Open</label><br />
                <input type="radio" name="open" value="closed" checked={this.state.open=='closed'} onChange={this.openChange} />
                <label>Closed</label>
            </form>
            <br />
            <button onClick={this.createStation}>Create Station</button>
            <p>{this.state.message}</p>
            <br /><br /><button onClick={this.nStationManagement}>Back to Station Management</button>
        </div>
        );
    },
    nameChange : function(e) {
        this.setState({ name: e.target.value} );
    },
    idChange : function(e) {
        this.setState({ id: e.target.value} );
    },
    fareChange : function(e) {
        this.setState({ fare: e.target.value } );
    },
    typeChange : function(e) {
        this.setState({ type: e.target.value} );
    },
    openChange : function(e) {
        this.setState({ open: e.target.value });
    },
    nearestChange : function(e) {
        this.setState( { nearest: e.target.value })
    },
    createStation : function() {
        if (this.state.id == '' || this.state.name == '' || this.state.fare == '') {
            alert('Please fill out all non-optional fields');
            return;
        }
        if (this.state.message != '')
            this.setState( { message: '' });
        fetch(server + '/createStation', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                 "StopID": this.state.id,
                 "Name": this.state.name,
                 "EnterFare": this.state.fare,
                 "ClosedStatus": this.state.open,
                 "IsTrain": this.state.type,
                 "Intersection": this.state.nearest
            })
        }).then(function(res){ return res.json(); }).then(function(data){ alert( data.message ) });
    },
    nStationManagement : function() { showStationManagement(); }
});

//
// Any components meant to be reused among the screens should be defined below
//



//
// Rendering functions for each screen called in onclicks
//

function showLogIn() {
    ReactDOM.render(<LogIn />, document.getElementById('root'));
}

function showRegistration() {
    ReactDOM.render(<Registration />, document.getElementById('root'));
}

function showPassengerFunctionality(username) {
    ReactDOM.render(<PassengerFunctionality 
						username={username}/>, document.getElementById('root'));
}

function showManageCards(username) {
    ReactDOM.render(<ManageCards 
						username={username}/>, document.getElementById('root'));
}

function showTripHistory(username) {
    ReactDOM.render(<TripHistory 
						username={username}/>, document.getElementById('root'));
}

function showViewStation(stationId) {
    ReactDOM.render(<ViewStation
                        initialId={stationId} />, document.getElementById('root'));
}

function showCreateStation() {
    ReactDOM.render(<CreateStation />, document.getElementById('root'));
}

function showAdminFunctionality() {
    ReactDOM.render(<AdminFunctionality />, document.getElementById('root'));
}

function showPassengerFlowReport() {
    ReactDOM.render(<PassengerFlowReport />, document.getElementById('root'));
}

function showSuspendedCards() {
    ReactDOM.render(<SuspendedCards />, document.getElementById('root'));
}

function showBreezecardManagement() {
    ReactDOM.render(<BreezecardManagement />, document.getElementById('root'));
}

function showStationManagement() {
    ReactDOM.render(<StationManagement />, document.getElementById('root'));
}

showLogIn();