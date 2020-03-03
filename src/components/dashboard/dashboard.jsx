import React, { Component } from 'react';
import ReactTable from 'react-table-6';
import {DebounceInput} from 'react-debounce-input';
require('../dashboard/style/dashboard.css');
const axios = require('axios');

export default class Dashboard extends Component {
    constructor(){
        super();
        // could have used redux but used local storage for time beign
        this.originalData = [];
        this.favorite_city = [];
        this.favorite_searched = [];
        this.loading = true;
        this.state ={
            currentCity: "MUMBAI",
            searchInput:'',
            row : [],
            coloumn :[
                {
                  Header: "Bank",
                  accessor: "bank_name"
                },
                {
                    Header: "IFSC",
                    accessor: "ifsc"
                },
                {
                    Header: "Branch",
                    accessor: "branch"
                },
                {
                    Header: "Bank - id ",
                    accessor: "bank_id"
                },
                {
                    Header: "Address",
                    accessor: "address"
                }
              ],

        }
    }
     componentDidMount(){
         //initail api cal;
                 this.fetchData();
                 var cities = localStorage.getItem("cities");
                 var searched = localStorage.getItem("searched");
               if(cities != null ){
                    this.favorite_city = cities.filter(word => word.length > 4);
                   
               }  
               if(searched != null ){
                
                    this.favorite_searched = searched.filter(word => word.length > 4);
                    
               }
            }

    componentWillUnmount(){
        localStorage.clear();
    }   
            
    // function used 
    
    fetchData(){
        let city = this.state.currentCity;
        let that = this;
        axios.get('https://vast-shore-74260.herokuapp.com/banks?city='+city)
        .then(function (response) {
            // handle success
            
            that.originalData = [...response.data];
            that.loading = false;
            that.setState({row:that.originalData});
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })

        // drop the values in local storage only if api call is made  favourite can be only if the user filters with it
        if(this.favorite_searched.length >0 ){
            localStorage.setItem("searched", JSON.stringify(this.favorite_searched));
        }
        if(this.favorite_city.length >0 ){
            localStorage.setItem("cities", JSON.stringify(this.favorite_city));
        }
        
        
    }
            changeInCityDropdown(event){
                let currentCity = event.target.value;
                if(this.favorite_city.indexOf(currentCity) == -1){
                    this.favorite_city.push(currentCity);
                }
                if(currentCity != this.state.currentCity){
                this.setState({ currentCity: currentCity },()=>{
                    this.fetchData();
                });
            }
        }  ;      
    handleSearchChange(event){
        let currentSearched = event.target.value;
        if(currentSearched.length > 6){

            this.favorite_searched.push(currentSearched);
        }
        this.setState({ searchInput: event.target.value }, () => {
          this.globalSearch();
        });
      };
      globalSearch(){
        let { searchInput } = this.state;
        if(searchInput.length>0){
        let filteredData = this.state.row.filter(value => {
          return (
            value.bank_name.toLowerCase().includes(searchInput.toLowerCase()) ||
            value.address.toLowerCase().includes(searchInput.toLowerCase()) ||
            value.branch.toLowerCase().includes(searchInput.toLowerCase()) ||
            value.ifsc.toLowerCase().includes(searchInput.toLowerCase()) ||
            value.bank_id
              .toString()
              .includes(searchInput.toLowerCase())
          );
        });
            this.setState({row:filteredData})
        
       
    }  
    else{
        this.setState({row:this.originalData})
    }
}

    render() {

        var searchHistory =   this.favorite_searched.map((item,i) =>{
                                     return( <li> {i+1} :- {item}</li>);
                              });
        
        var favorite_city = this.favorite_city.map((item,i) =>{
            return( <li> {i+1} :- {item}</li>);
     });

      if(this.loading){
          return(
            <div className = "dashboard_container">
            <div className="loader"></div>
            <span> Please wait for Data to Load</span>
            </div>

          )
      }
      else{
        return (
            <React.Fragment>
                <div className = "dashboard_container">
                    <h1> Assignment </h1> 
                    <p> did this in 2 hours 30mins.  didnot concentrate much on css and layout</p><br/>
                    <p> could have used redux but did with local storage has in mail it didnot asked to use redux </p>
                    <p> please check my hawakai project in github </p>
                    
                    <div>
          <div className = 'filterTab'>  
          <ul style = {{"display": "inline-flex","float":'left'}}>
             <li> 
                 <div className = 'input'>       
          <DebounceInput
          minLength={2}
          debounceTimeout={300}
          onChange = {this.handleSearchChange.bind(this)}
          placeholder= {"Search"}
            />
            </div>
            </li>
            <li>
            <select 
                    value={this.state.currentCity} 
                    onChange={this.changeInCityDropdown.bind(this)} 
            >
       <option value="BANGALORE">Bangalore</option>
        <option value="CHENNAI">Chennai</option>
        <option value="MUMBAI">Mumbai</option>
        <option value="COCHIN">Kochin</option>
        <option value="MYSORE">Mysore</option>
      </select>
        </li>
        
                </ul>
          </div> 
          </div>
          <br />
          <div className = "favorites">
                <div style = {{'float':'left'}}>
                    <h5>recent Search</h5>
                    {searchHistory}
                    </div>
                <div style = {{'float':'right'}}>
                    <h6> favorite City</h6>
                    {favorite_city}
                </div>
        </div>
          <br/>
                <ReactTable
                    data={this.state.row}
                    columns={this.state.coloumn}
                    defaultPageSize={10}
                    className="-striped -highlight"
                 />
                </div>
            </React.Fragment>
        )
    }
}
}
